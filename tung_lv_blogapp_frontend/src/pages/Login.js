import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import CustomNotification from '../components/common/CustomNotification'
import styles from '../css/user/Login.module.css'

function Login({ setAuthenticated }) {
	useEffect(() => {
		document.title = 'Login'
	}, [])

	const navigate = useNavigate()
	const [form] = Form.useForm()
	const handleSubmit = (user) => {
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
				CustomNotification('success', 'Success', response.data.message, 3)

				sessionStorage.setItem('user', JSON.stringify(response.data.user))

				setAuthenticated(true)

				navigate('/posts')

				setTimeout(() => {
					navigate("/logout")
					CustomNotification('info', 'Session timeout', 'Please login again!', 5)
				}, 1800000)
			})
			.catch((err) => CustomNotification('error', 'Failed', err.response.data.error.message, 3))
	}

	return (
		<section>
			<Navbar />
			<div className={styles['login-wrapper']}>
				<div className={styles['login-container']}>
					<Form name="normal_login" onFinish={handleSubmit} form={form}>
						<h1 className={styles['login-title']}>Login</h1>

						<div className={styles['input-box']}>
							<Form.Item
								name="email"
								rules={[
									{
										type: 'email',
										message: 'The input is not valid E-mail!',
									},
									{
										required: true,
										message: 'Please input your Email!',
									},
								]}
								className={styles['error-message']}
							>
								<Input
									className={styles['form-item']}
									prefix={<UserOutlined className="site-form-item-icon" />}
									placeholder="Email"
								/>
							</Form.Item>
						</div>

						<div className={styles['input-box']}>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your Password!',
									},
								]}
								className={styles['error-message']}
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									placeholder="Password"
								/>
							</Form.Item>
						</div>

						<Form.Item>
							<Button htmlType="submit" className={styles['login-btn']}>
								Log in
							</Button>
						</Form.Item>

						<Link className={styles['register-link']} to="/register">
							Don't have account yet? Register now!
						</Link>
					</Form>
				</div>
			</div>
		</section>
	)
}
export default Login