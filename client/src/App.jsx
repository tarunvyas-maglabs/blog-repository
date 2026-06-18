import { useEffect, useState } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import BlogForm from './components/BlogForm'
import User from './components/User'
import { useNotificationActions } from './store'
import { useBlogs, useBlogActions, useUser, useUserAction } from './store'
import { getUser, saveUser, removeUser } from './services/persistentUser'
import useField from './hooks/useField'

import {
  TextField,
  Button,
  Container,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'

const App = () => {
  const username = useField('text')
  const password = useField('password')
  const [users, setUsers] = useState([])
  const user = useUser()
  const setUser = useUserAction()
  const { setNotification } = useNotificationActions()
  const blogs = useBlogs()
  const { initialize } = useBlogActions()

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  const userMatch = useMatch('/users/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const userInfo = userMatch ? users.find(user => user.id === userMatch.params.id): null

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username: username.value, password: password.value })
      blogService.setToken(user.token)
      setUser(user)
      saveUser(user)
      username.setValue('')
      password.setValue('')
      navigate('/')
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    removeUser()
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <h2>Log in to application</h2>
      <div>
        <TextField
          id="standard-basic"
          label="username"
          variant="standard"
          type={username.type}
          value={username.value}
          onChange={username.onChange}
        />
      </div>
      <div>
        <TextField
          id="standard-basic"
          label="password"
          variant="standard"
          type={password.type}
          value={password.value}
          onChange={password.onChange}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" style={{ marginTop: 20 }}>
          login
        </Button>
      </div>
    </form>
  )

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loggedUser = getUser()
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    userService.getAll().then(data => {
      console.log(users)
      setUsers(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            BLOG APP
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>
            home
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={style}>
            users
          </Button>
          {!user && (
            <Button color="inherit" component={Link} to="/login" sx={style}>
              login
            </Button>
          )}
          {user && (
            <>
              <Button color="inherit" component={Link} to="/create" sx={style}>
                new blog
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={style}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <div style={{ marginTop: 20 }}>
          <Notification />
        </div>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
              />
            }
          />
          <Route path="/" element={<BlogList blogs={blogs}/>} />
          <Route path="/login" element={loginForm()} />
          <Route
            path="/create"
            element={<BlogForm />}
          />
          <Route path='/users' element={<UserList users={users}/>}/>
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          <Route path='/users/:id' element={<User userInfo={userInfo} />}/>
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
