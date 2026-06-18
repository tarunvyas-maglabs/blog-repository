import { Alert } from '@mui/material'
import { useNotification } from '../store'

const Notification = () => {
  const notification = useNotification()
  if (notification === null) {
    return null
  }

  return <Alert severity={notification.type}>{notification.text}</Alert>
}

export default Notification
