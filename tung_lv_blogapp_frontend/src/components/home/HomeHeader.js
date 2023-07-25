import React from 'react'
import styles from '../../css/home/HomeHeader.module.css'

function Header() {
	return (
		<header className={styles['home-header']}>
			<div className={styles['web-title']}>
				<h1>VTS</h1>
				<h1>VTS</h1>
			</div>

			<h2>"Hala Madrid"</h2>
			<p>
				Blogging is to writing what extreme sports are to athletics: more free-form, more
				accident-prone, less formal, more alive.
			</p>
		</header>
	)
}

export default Header
