import { Card, CardContent, Typography, Link, Button, TextField } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogActions } from '../store'
import useField from '../hooks/useField'

const Blog = ({ blog, user }) => {
  const id = useParams().id
  const userName = user ? user.name : null
  const { deleteBlog, updateBlog, addComment } = useBlogActions()
  const navigate = useNavigate()
  const comment = useField('text')

  const handleLike = () => {
    const updatedBlogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    updateBlog(id, updatedBlogObject)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(id)
      navigate('/')
    }
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addComment(id, {
      comment: comment.value
    })
    comment.setValue('')
  }

  if (!blog) {
    return <h2>404 - Page Not Found</h2>
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          By {blog.author}
        </Typography>
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          <Link>{blog.url}</Link>
        </div>
        <Typography sx={{ marginTop: 1, marginBottom: 1 }} variant="body2">
          Added by {blog.user.name}
        </Typography>
        <div style={{ marginTop: 5 }}>
          <Typography component="div">
            {blog.likes} likes
            {user && (
              <Button
                variant="outlined"
                onClick={handleLike}
                sx={{ marginLeft: 1 }}
              >
                like
              </Button>
            )}
            {blog.user.name === userName && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{ marginLeft: 1 }}
              >
                delete
              </Button>
            )}
          </Typography>
        </div>
        <div style={{ marginTop: 20 }}>
          <Typography variant="h6">Comments</Typography>
          <form onSubmit={handleAddComment}>
            <div>
              <TextField id="outlined-basic" variant="outlined" placeholder="add a comment" size="small" sx={ { marginRight: 2 }} type={comment.type} value={comment.value} onChange={comment.onChange}/>
              <Button variant="contained" size="medium" type="submit">add comment</Button>
            </div>
          </form>
          <ul>
            {blog.comments?.map(comment => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default Blog
