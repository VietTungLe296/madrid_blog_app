import Navbar from '../components/common/Navbar'
import { Form, Button, Input, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from '../css//post/PostForm.module.css'
import { Footer } from 'antd/es/layout/layout'
import TextArea from 'antd/es/input/TextArea'
import GoBackButton from '../components/common/GoBackButton'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import CustomNotification from '../components/common/CustomNotification'

function EditPost() {
	const { id } = useParams()
	const [post, setPost] = useState()
	const navigate = useNavigate()
	const [fileList, setFileList] = useState([])
	const [newThumbnail, setNewThumbnail] = useState()

	const getBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = (error) => reject(error)
		})

	useEffect(() => {
		axios
			.get(`http://localhost:9000/v1/posts/${parseInt(id)}`)
			.then(async (response) => {
				console.log()
				const res = await fetch(response?.data?.post['thumbnail'])
				const fileName = res['url'].split('/')
				const data = await res.blob()
				const metadata = {
					type: data.type,
				}
				const file = new File([data], fileName[fileName.length - 1], metadata)
				const uid = new Date().getTime().toString(36)
				setFileList([
					{ uid: uid, name: file.name, status: 'done', url: response?.data?.post['thumbnail'] },
				])
				setPost(response.data.post)
			})
			.catch((err) => {
				CustomNotification('error', 'Failed', err.response.data.error.message, 3)
				navigate('/posts')
			})

		document.title = 'Update Post'
	}, [id, navigate])

	const { form } = Form.useForm()
	const handleSubmit = (post) => {
		if (window.confirm('Are you sure you want to update this post?')) {
			const formData = new FormData()
			formData.append('author', post.author)
			formData.append('title', post.title)
			formData.append('content', post.content)

			if (fileList.length > 0) {
				formData.append('thumbnail', newThumbnail)
			}

			axios
				.patch(`http://localhost:9000/v1/posts/${id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					withCredentials: true,
				})
				.then((response) => {
					CustomNotification('success', 'Success', response.data.message, 3)

					setTimeout(() => navigate('/user/posts'), 1500)
				})
				.catch((err) => CustomNotification('error', 'Failed', err.response.data.error.message, 3))
		}
	}

	const handleUpload = async (file) => {
		setNewThumbnail(file)
		const base64 = await getBase64(file)
		setFileList([{ uid: file.uid, name: file.name, status: 'done', url: base64 }])
		window.onload((e) => e.preventDefault())
	}

	const validateImageType = async (rule, value, callback) => {
		if (!value && !fileList) return Promise.reject('Thumbnail is required')
		if (value && value.length > 0) {
			const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
			const isAcceptedType = value.every((file) => acceptedTypes.includes(file.type))
			if (!isAcceptedType) {
				return Promise.reject('Only JPEG, PNG, WEBP, and SVG files are allowed')
			}
		}
		return Promise.resolve()
	}

	return (
		<div>
			<Navbar />

			<GoBackButton />

			<div className={styles['newpost-container']}>
				<h1 className={styles['newpost-title']}>Update Post</h1>

				{post ? (
					<Form
						labelCol={{ span: 6 }}
						wrapperCol={{ span: 14 }}
						form={form}
						layout="horizontal"
						className={styles['newpost-form']}
						onFinish={handleSubmit}
					>
						<Form.Item
							name="image"
							label="Thumbnail"
							valuePropName="fileList"
							getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
							rules={[{ validator: validateImageType }]}
						>
							<Upload
								name="image"
								maxCount={1}
								listType="picture-card"
								beforeUpload={handleUpload}
								fileList={fileList}
								showUploadList={false}
							>
								{fileList.length > 0 ? (
									<img
										src={fileList[0].url}
										key={fileList[0].uid}
										alt="thumbnail"
										style={{
											width: '100%',
										}}
									/>
								) : (
									<div>
										<PlusOutlined />
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								)}
							</Upload>
						</Form.Item>

						<Form.Item
							name="title"
							label="Title"
							initialValue={post.title}
							rules={[
								{
									required: true,
									message: 'Title is required',
								},
								{
									max: 150,
									message: 'Maximum title length is 150 characters',
								},
								{
									pattern: '^.{1,150}$',
									message: 'Title must not be empty and maximum length is 150 characters',
								},
							]}
						>
							<Input maxLength={150} />
						</Form.Item>

						<Form.Item
							name="author"
							label="Author name"
							initialValue={post.author}
							tooltip={`Your username will be used as default`}
							rules={[
								{
									required: true,
									message:
										'Author name length should be 3-50 characters, including letters, numbers or underscores',
								},
								{
									min: 3,
									message: 'Author name must be at least 3 characters',
								},
								{
									max: 50,
									message: 'Author name must be at most 50 characters',
								},
								{
									pattern: '^[A-Za-z][A-Za-z0-9_]{3,50}$',
									message:
										'Author name can only contain letters, numbers and underscores! Start with letters',
								},
							]}
						>
							<Input maxLength={50} />
						</Form.Item>

						<Form.Item
							name="content"
							label="Content"
							initialValue={post.content}
							rules={[
								{
									required: true,
									message: 'Content is required',
								},
							]}
						>
							<TextArea rows={10} showCount={true} />
						</Form.Item>

						<Form.Item className={styles['submit-btn']}>
							<Button type="primary" htmlType="submit-btn">
								Update
							</Button>
						</Form.Item>
					</Form>
				) : (
					''
				)}
			</div>
			<Footer className={styles['footer']}>©2023 Created by Viet Tung Le</Footer>
		</div>
	)
}

export default EditPost
