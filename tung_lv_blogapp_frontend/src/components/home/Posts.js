import React from 'react'
import PostItem from '../post/PostItem'
import styles from '../../css/home/Posts.module.css'

const Posts = ({ posts }) => (
	<div className={styles["posts-wrapper"]}>
		{posts.map((post) => (
			<PostItem post={post} key={post.id} />
		))}
	</div>
)

export default Posts
