import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

function CreatePostButton() {
	return (
		<Link to={'/posts/create'}>
			<Button type="primary">+ Create New Post</Button>
		</Link>
	)
}

export default CreatePostButton
