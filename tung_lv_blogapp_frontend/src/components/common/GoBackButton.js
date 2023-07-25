import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "../../css/common/GoBackButton.module.css"

function GoBackButton() {
	const navigate = useNavigate()

	const handleGoBack = () => navigate(-1)

	return (
		<Button
			type="ghost"
			className={styles["goback-btn"]}
			style={{
				backgroundColor: 'darkgrey',
			}}
			onClick={handleGoBack}
		>
			Back
		</Button>
	)
}

export default GoBackButton
