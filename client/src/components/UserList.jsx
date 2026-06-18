import { Link } from 'react-router-dom'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

const UserList = ({ users }) => {
  if(!users) {
    return null
  }

  return(
    <div>
      <h2>Users</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell><Link to={`/users/${user.id}`} style={{ textDecoration: null }} >{user.name}</Link></TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>

          ))}
        </TableBody>
      </Table>

    </div>
  )
}

export default UserList