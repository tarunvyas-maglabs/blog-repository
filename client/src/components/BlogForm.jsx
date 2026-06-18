import { TextField, Button } from '@mui/material'
import { useBlogActions, useNotificationActions } from '../store'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'

const BlogForm = () => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const navigate = useNavigate()
  const { setNotification } = useNotificationActions()
  const { createBlog } = useBlogActions()

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    }
    createBlog(newBlog)
    setNotification({
      text: `added blog '${newBlog.title}' by ${newBlog.author}`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
    navigate('/')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            id="outlined-basic"
            label="title"
            variant="outlined"
            type={title.type}
            value={title.value}
            onChange={title.onChange}
            placeholder="enter title"
            sx={{ width: 500, maxWidth: '100%' }}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="author"
            variant="outlined"
            type={author.type}
            value={author.value}
            onChange={author.onChange}
            placeholder="enter author"
            sx={{ width: 500, maxWidth: '100%', marginTop: 2 }}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="url"
            variant="outlined"
            type={url.type}
            value={url.value}
            onChange={url.onChange}
            placeholder="enter url"
            sx={{ width: 500, maxWidth: '100%', marginTop: 2 }}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" sx={{ marginTop: 3 }}>
            create
          </Button>
        </div>
      </form>
    </>
  )
}

export default BlogForm
