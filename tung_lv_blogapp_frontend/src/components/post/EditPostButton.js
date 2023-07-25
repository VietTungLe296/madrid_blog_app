import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../css/post/PostAction.module.css'

const EditPostButton = ({ id }) => {
	const navigate = useNavigate()
	const handleEdit = () => navigate(`/posts/${id}/edit`)
	return (
		<Button className={`${styles['action-btn']} ${styles['edit-btn']}`} onClick={handleEdit}>
			Edit
		</Button>
	)
}

export default EditPostButton
