import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { BrowserRouter as Router } from 'react-router-dom'
import { vi } from 'vitest'

const createNew = vi.fn()
const setNotification = vi.fn()

vi.mock('../store', () => ({
  useBlogActions: () => ({ createBlog: createNew }),
  useNotificationActions: () => ({ setNotification })
}))

test.only('calls the event handler it received as props with the right details when a new blog is created', async () => {
  const user = userEvent.setup()

  render(
    <Router>
      <BlogForm/>
    </Router>
  )


  const title = screen.getByPlaceholderText('enter title')
  const author = screen.getByPlaceholderText('enter author')
  const url = screen.getByPlaceholderText('enter url')

  const saveButton = screen.getByText('create')

  await user.type(title, 'go is the best')
  await user.type(author, 'primeagen')
  await user.type(url, 'terminal.sh')

  await user.click(saveButton)

  expect(createNew.mock.calls).toHaveLength(1)
  expect(createNew.mock.calls[0][0].title).toBe('go is the best')
  expect(createNew.mock.calls[0][0].author).toBe('primeagen')
  expect(createNew.mock.calls[0][0].url).toBe('terminal.sh')
})
