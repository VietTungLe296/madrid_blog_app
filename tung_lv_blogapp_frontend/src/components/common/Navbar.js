import React, { useEffect, useState } from 'react'
import styles from '../../css/common/Navbar.module.css'
import { Link } from 'react-router-dom'

function Navbar() {
	const user = JSON.parse(sessionStorage.getItem('user'))
	const [isActive, setActive] = useState(false)

	useEffect(() => {}, [user])

	const showNavbar = () => setActive((prevState) => !prevState)

	return (
		<div className={styles['navbar-container']}>
			<nav className={styles['navbar']}>
				<ul className={styles['menu']}>
					<li className={`${styles.logo} ${isActive ? styles['active'] : ''}`}>
						<Link to="/">
							<img src="/assets/logo.png" alt="logo" />
						</Link>
					</li>

					<li className={`${styles.item} ${isActive ? styles['active'] : ''}`}>
						<Link to="/">Home</Link>
					</li>

					{user ? (
						<li className={`${styles.item} ${isActive ? styles['active'] : ''}`}>
							<Link to="/user/posts" reloadDocument>
								My Posts
							</Link>
						</li>
					) : (
						''
					)}

					{!user ? (
						<li className={`${styles.item} ${styles.button} ${isActive ? 'active' : ''}`}>
							<Link to="/login">Login</Link>
						</li>
					) : (
						<li className={`${styles.item} ${styles.button} ${isActive ? styles['active'] : ''}`}>
							<p className={styles.username}>Hi, {user.username}</p>
						</li>
					)}

					{!user ? (
						<li
							className={`${styles.item} ${styles.button} ${styles.secondary} ${
								isActive ? 'active' : ''
							}`}
						>
							<Link to="/register">Sign up</Link>
						</li>
					) : (
						<li className={`${styles.item} ${styles.button}  ${isActive ? 'active' : ''}`}>
							<Link to="/logout">Logout</Link>
						</li>
					)}

					<li className={styles['toggle']} onClick={showNavbar}>
						<span className={styles['bars']}></span>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Navbar
