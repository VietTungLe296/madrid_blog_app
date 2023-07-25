import React from 'react'
import Navbar from '../components/common/Navbar'
import { Form, Button, Upload, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from '../css//post/PostForm.module.css'
import { Footer } from 'antd/es/layout/layout'
import TextArea from 'antd/es/input/TextArea'
import GoBackButton from '../components/common/GoBackButton'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CustomNotification from '../components/common/CustomNotification'

function CreatePost() {
	const [fileList, setFileList] = useState([])
	useEffect(() => {
		document.title = 'Create New Post'
	}, [])

	const initialValues = {
		author: JSON.parse(sessionStorage.getItem('user')).username,
	}

	const handleUpload = (file) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			setFileList((prevList) => [
				...prevList,
				{ uid: file.uid, name: file.name, status: 'done', url: reader.result },
			])
		}
		return false // Prevent the default upload behavior
	}

	const validateImageType = (rule, value, callback) => {
		if (value && value.length > 0) {
			const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
			const isAcceptedType = value.every((file) => acceptedTypes.includes(file.type))
			if (!isAcceptedType) {
				return Promise.reject('Only JPEG, PNG, WEBP, and SVG files are allowed')
			}
		}
		return Promise.resolve()
	}

	const { form } = Form.useForm()
	const navigate = useNavigate()
	const handleSubmit = (post) => {
		if (window.confirm('Are you sure you want to create this post?')) {
			const formData = new FormData()
			formData.append('thumbnail', post.image[0].originFileObj)
			formData.append('author', post.author)
			formData.append('title', post.title)
			formData.append('content', post.content)

			axios
				.post('http://localhost:9000/v1/posts', formData, {
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

	return (
		<div>
			<Navbar />

			<GoBackButton />

			<div className={styles['newpost-container']}>
				<h1 className={styles['newpost-title']}>Create Post</h1>

				<Form
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 14 }}
					form={form}
					layout="horizontal"
					className={styles['newpost-form']}
					initialValues={initialValues}
					onFinish={handleSubmit}
				>
					<Form.Item
						name="image"
						label="Thumbnail"
						valuePropName="fileList"
						getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
						rules={[
							{
								required: true,
								message: 'Thumbnail is required',
							},
							{ validator: validateImageType },
						]}
					>
						<Upload
							name="image"
							maxCount={1}
							listType="picture-card"
							beforeUpload={handleUpload}
							fileList={fileList}
							onRemove={() => setFileList([])}
						>
							{fileList.length === 0 && (
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
						rules={[
							{
								required: true,
								message: 'Title is required',
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
								pattern: '^[A-Za-z][A-Za-z0-9_]{2,49}$',
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
							Create
						</Button>
					</Form.Item>
				</Form>
			</div>
			<Footer className={styles['footer']}>©2023 Created by Viet Tung Le</Footer>
		</div>
	)
}

export default CreatePost
