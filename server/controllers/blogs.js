const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const returnBlog = await Blog.findById(savedBlog.id).populate('user', {
    username: 1,
    name: 1,
  })
  return response.status(201).json(returnBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(blog.id)

      user.blogs = user.blogs.filter((b) => b.id !== blog.id)
      await user.save()

      return response.status(204).end()
    }
    return response.status(401).json({ error: 'unauthorized access' })
  },
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const user = await User.findById(body.user)
  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }

  blog.title = body.title
  blog.author = body.author
  blog.url = body.url
  blog.likes = body.likes
  blog.user = user._id

  await blog.save()
  const updatedBlog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  return response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.comments = blog.comments.concat(body.comment)
  const updatedBlog = await blog.save()
  return response.json(updatedBlog)
})

module.exports = blogsRouter
