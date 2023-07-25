import React from 'react'

function EmptyPage() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<h1>Oops! Empty Page</h1>

			<img
				style={{
					maxWidth: '250px',
					width: '100%',
				}}
				src={process.env.PUBLIC_URL + '/assets/emptyPage.gif'}
				alt="empty"
			/>
		</div>
	)
}

export default EmptyPage
