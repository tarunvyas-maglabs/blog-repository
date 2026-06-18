import { Typography } from '@mui/material'

const User = ({ userInfo }) => {
  if (!userInfo) {
    return null
  }
  return (
    <div>
      <Typography variant='h4'>{userInfo.name}</Typography>
      <Typography variant='h5'>added blogs</Typography>
      <ul>
        {userInfo.blogs?.map(blog => (
          <li>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User