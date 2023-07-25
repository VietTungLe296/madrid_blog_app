import { Button } from 'antd'
import React from 'react'
import { CSVLink } from 'react-csv'
import styles from "../../css/post/PostAction.module.css"
function ExportCSV({ post }) {
	const data = [
		{
			author: post.author,
			title: post.title,
			created_at: post.created_at,
			updated_at: post.updated_at,
		},
	]

	return (
		<Button className={`${styles['action-btn']} ${styles['export-btn']}`}>
			<CSVLink data={data} filename={`${post.title}.csv`}>
				Export as CSV File
			</CSVLink>
		</Button>
	)
}

export default ExportCSV
