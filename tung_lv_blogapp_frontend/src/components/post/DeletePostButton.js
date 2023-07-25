import { Button } from 'antd'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import CustomNotification from '../common/CustomNotification'
import styles from '../../css/post/PostAction.module.css'

const DeletePostButton = ({ id }) => {
	const navigate = useNavigate()
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			axios
				.delete(`http://localhost:9000/v1/posts/${id}`, { withCredentials: true })
				.then((response) => {
					CustomNotification('success', 'Success', response.data.message, 4)
					navigate('/user/posts')
				})
				.catch((err) => CustomNotification('error', 'Failed', err.response.data.error.message, 4))
		}
	}
	return (
		<Button className={`${styles['action-btn']} ${styles['delete-btn']}`} onClick={handleDelete}>
			Delete
		</Button>
	)
}

export default DeletePostButton
