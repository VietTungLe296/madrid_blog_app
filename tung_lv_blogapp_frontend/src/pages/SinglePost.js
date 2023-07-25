import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyPage from '../components/common/EmptyPage'
import styles from '../css/post/SinglePost.module.css'
import GoToTopButton from '../components/common/GoToTopButton'
import GoBackButton from '../components/common/GoBackButton'
import Navbar from '../components/common/Navbar'
import { Footer } from 'antd/es/layout/layout'
import axios from 'axios'
import ExportCSV from '../components/post/ExportCSV'
import DeletePostButton from '../components/post/DeletePostButton'
import EditPostButton from '../components/post/EditPostButton'

const SinglePost = ({ authenticated }) => {
	const [userId, setUserId] = useState()
	const [post, setPost] = useState(null)
	const [scroll, setScroll] = useState()
	const { id } = useParams()

	useEffect(() => {
		document.title = 'Post'

		if (authenticated) {
			setUserId(JSON.parse(sessionStorage.getItem('user')).userId)
		}
		axios
			.get(`http://localhost:9000/v1/posts/${parseInt(id)}`)
			.then((response) => setPost(response.data.post))

		const handleScroll = () => setScroll(window.scrollY > 200)
		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [id, authenticated])

	return (
		<div>
			<Navbar />

			{post ? (
				<div className={styles['post-wrapper']}>
					<GoBackButton />
					<div className={styles['post-date']}>
						<p>Published: {post.createdAt}</p>
						<p>Last updated: {post.updatedAt}</p>
					</div>

					<div className={styles['post-action']}>
						{post.userId === userId ? (
							<div className={styles['post-crud']}>
								<EditPostButton id={id} />
								<DeletePostButton id={id} />
							</div>
						) : (
							''
						)}

						<ExportCSV post={post} />
					</div>

					<div className={styles['post-header']}>
						<h1>{post.title}</h1>
						<h2>by {post.author}</h2>
					</div>

					<div className={styles['post-thumbnail']}>
						<img src={post.thumbnail} alt="thumbnail" />
					</div>

					<div className={styles['post-content']}>
						<p>{post.content}</p>
					</div>

					{scroll && <GoToTopButton />}
				</div>
			) : (
				<EmptyPage />
			)}
			<Footer style={{ textAlign: 'center' }}>©2023 Created by Viet Tung Le</Footer>
		</div>
	)
}

export default SinglePost
