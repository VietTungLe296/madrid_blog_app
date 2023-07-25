import { Button, Form, Input } from 'antd'
import axios from 'axios'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomNotification from '../components/common/CustomNotification'
import Navbar from '../components/common/Navbar'
import styles from '../css/user/Register.module.css'

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24,
		},

		sm: {
			span: 6,
		},
	},
}

function Register({ setAuthenticated }) {
	const [emailErrorMessage, setEmailErrorMessage] = useState()
	const [usernameErrorMessage, setUsernameErrorMessage] = useState()

	useEffect(() => {
		document.title = 'Register Form'
	}, [])

	const validateEmail = (e) => {
		axios
			.post(`http://localhost:9000/v1/users/email`, {
				email: e.target.value,
			})
			.then(setEmailErrorMessage({ isValid: true }))
			.catch((err) => setEmailErrorMessage({ isValid: false, message: err.response.data }))
	}

	const validateUsername = (e) => {
		axios
			.post(`http://localhost:9000/v1/users/username`, {
				username: e.target.value,
			})
			.then(setUsernameErrorMessage({ isValid: true }))
			.catch((err) => setUsernameErrorMessage({ isValid: false, message: err.response.data }))
	}

	const navigate = useNavigate()
	const [form] = Form.useForm()
	const handleSubmit = (user) => {
		axios
			.post(`http://localhost:9000/v1/register`, {
				email: user.email,
				username: user.username,
				password: user.password,
			})
			.then((response) => {
				CustomNotification('success', 'Success', response.data.message, 3)
				axios
					.post(
						`http://localhost:9000/v1/login`,
						{
							email: user.email,
							password: user.password,
						},
						{ withCredentials: true }
					)
					.then((response) => {
						sessionStorage.setItem('user', JSON.stringify(response.data.user))
						setAuthenticated(true)
						navigate('/posts')

						setTimeout(() => {
							navigate('/logout')

							CustomNotification('info', 'Session timeout', 'Please login again!', 5)
						}, 1800000)
					})
					.catch((err) => {
						CustomNotification('error', 'Failed', err.response.data.error.message, 3)
					})
			})
			.catch((err) => {
				CustomNotification('error', 'Failed', err.response.data.error.message, 3)
			})
	}

	return (
		<section>
			<Navbar />
			<div className={styles['register-wrapper']}>
				<div className={styles['register-container']}>
					<Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit}>
						<h1 className={styles['register-title']}>Register</h1>

						<div className={styles['input-box']}>
							<Form.Item
								name="email"
								label="E-mail"
								hasFeedback
								rules={[
									{
										type: 'email',
										message: 'The input is not valid E-mail!',
									},

									{
										required: true,
										message: 'Email required!',
									},

									{
										pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
										message: 'Mail address must has format xxx@yyy.zzz!',
									},
								]}
								className={styles['error-message']}
								validateStatus={emailErrorMessage?.isValid === false ? 'error' : ''}
								help={emailErrorMessage?.message}
								onBlur={validateEmail}
							>
								<Input />
							</Form.Item>
						</div>

						<div className={styles['input-box']}>
							<Form.Item
								name="username"
								label="Username"
								tooltip="What do you want others to call you?"
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Username required!',
									},

									{
										min: 3,
										message: 'Username must be at least 3 characters!',
									},

									{
										max: 50,
										message: 'Username must be less than 50 characters!',
									},

									{
										pattern: '^[A-Za-z][A-Za-z0-9_]{2,49}$',
										message: 'Username can only contain letters, numbers and underscores!',
									},
								]}
								className={styles['error-message']}
								validateStatus={usernameErrorMessage?.isValid === false ? 'error' : ''}
								help={usernameErrorMessage?.message}
								onBlur={validateUsername}
							>
								<Input maxLength={50} />
							</Form.Item>
						</div>

						<div className={styles['input-box']}>
							<Form.Item
								name="password"
								label="Password"
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},

									{
										min: 8,
										message: 'Password must be at least 8 characters!',
									},

									{
										max: 20,
										message: 'Password must be less than 20 characters!',
									},

									{
										pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$',
										message:
											'Password must including letters, at least one number and one special character!',
									},
								]}
								className={styles['error-message']}
							>
								<Input.Password maxLength={20} />
							</Form.Item>
						</div>

						<div className={styles['input-box']}>
							<Form.Item
								name="confirm"
								label="Confirm Password"
								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please confirm your password!',
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve()
											}
											return Promise.reject(
												new Error('The two passwords that you entered do not match!')
											)
										},
									}),
								]}
								className={styles['error-message']}
							>
								<Input.Password maxLength={20} />
							</Form.Item>
						</div>

						<Form.Item>
							<Button htmlType="submit" className={styles['register-btn']}>
								Submit
							</Button>
						</Form.Item>

						<Link className={styles['login-link']} to="/login">
							Already have account? Sign in now!
						</Link>
					</Form>
				</div>
			</div>
		</section>
	)
}
export default Register
