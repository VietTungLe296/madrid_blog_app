import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../css/post/PostItem.module.css'
import ExportCSV from './ExportCSV'

function PostItem({ post }) {
	const { id, author, title, thumbnail, content, createdAt, updatedAt } = post

	return (
		<div className={styles['postItem-container']}>
			<Link className={styles['postItem-link']} to={`/posts/${id}`}>
				<div className={styles['postItem-wrapper']}>
					<img className={styles['postItem-thumbnail']} src={thumbnail} alt="thumbnail" />

					<h3 className={styles['postItem-title']}>{title}</h3>

					<p className={styles['postItem-content']}>{content}</p>

					<footer>
						<div className={styles['postItem-author']}>
							<h6>{author}</h6>
							<p>Created at: {createdAt}</p>
							<p>Updated at: {updatedAt}</p>
						</div>
					</footer>
				</div>
			</Link>
			<ExportCSV post={post} />
		</div>
	)
}

export default PostItem
