import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomNotification from '../common/CustomNotification'

async function logout() {
	try {
		await axios
			.post('http://localhost:9000/v1/logout', {}, { withCredentials: true })
			.then((response) => CustomNotification('info', 'Logged out', response.data.message, 3))
	} catch (error) {
		CustomNotification('info', 'Logged out', 'An error occured while logging out!', 3)
		console.log(error)
	}
}

function Logout({ setAuthenticated }) {
	const navigate = useNavigate()

	useEffect(() => {
		sessionStorage.clear()
		logout()
		setAuthenticated(false)

		navigate('/posts')
	}, [])

	return null
}
export default Logout
