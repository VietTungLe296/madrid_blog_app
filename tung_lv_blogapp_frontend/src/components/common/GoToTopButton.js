import React from 'react'
import { Button } from 'antd'

function GoToTopButton() {
	return (
		<Button
			style={{
				position: 'fixed',
				top: '86%',
				right: '1%',
				textAlign: 'center',
				backgroundColor: 'black',
				color: 'white',
				opacity: 0.5,
			}}
			value="large"
			onClick={() => window.scrollTo(0, 0)}
		>
			Go To Top
		</Button>
	)
}

export default GoToTopButton
