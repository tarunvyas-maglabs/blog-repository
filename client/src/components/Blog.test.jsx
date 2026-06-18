import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { BrowserRouter as Router } from 'react-router-dom'

test('renders blog title, author, url and likes but not the buttons when user is not logged in', async () => {
  const blog = {
    title: 'Clean code is required',
    author: 'Uncle Bob',
    url: 'http://objectorientedprogamming.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  render(<Router><Blog blog={blog} /></Router>)

  screen.debug()

  expect(screen.getByText(`${blog.title}`)).toBeVisible()
  expect(screen.getByText(`By ${blog.author}`)).toBeVisible()
  expect(screen.getByText(`${blog.url}`)).toBeVisible()
  expect(screen.getByText(`${blog.likes} likes`)).toBeVisible()
  const likeButton = screen.queryByRole('button', { name: 'like' })
  const deleteButton = screen.queryByRole('button', { name: 'delete' })
  expect(likeButton).toBeNull()
  expect(deleteButton).toBeNull()
})

test('authenticated user who is not the blog creator is only shown like button', async () => {
  const blog = {
    title: 'Clean code is required',
    author: 'Uncle Bob',
    url: 'http://objectorientedprogamming.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  const user = {
    username: 'artos',
    name: 'Artos Hellas',
  }

  render(<Router><Blog blog={blog} user={user} /></Router>)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  const deleteButton = screen.queryByRole('button', { name: 'delete' })
  expect(deleteButton).toBeNull()
})

test('blog creator is also shown the delete button', async () => {
  const blog = {
    title: 'Clean code is required',
    author: 'Uncle Bob',
    url: 'http://objectorientedprogamming.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  const user = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  }

  render(<Router><Blog blog={blog} user={user} /></Router>)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'delete' })).toBeVisible()
})
