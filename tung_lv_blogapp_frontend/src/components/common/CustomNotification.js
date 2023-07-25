import { notification } from 'antd'

function CustomNotification(type, message, description, duration ) {
	notification[type]({
		message,
		description,
		duration,
	})
}

export default CustomNotification
