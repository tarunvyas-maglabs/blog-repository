const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Fullstack is amazing',
    author: 'John Doe',
    url: 'http://fullstackamazing.com',
    likes: 6,
  },
  {
    title: 'Linux is amazing',
    author: 'Linus Torvalds',
    url: 'http://linux.com',
    likes: 700,
  },
]

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const newUser = new User({ username: 'root', passwordHash: passwordHash })
  await newUser.save()

  const user = await User.findOne({ username: newUser.username })

  const promisesArray = []
  for (const blog of initialBlogs) {
    const updatedBlog = new Blog({
      ...blog,
      user: user._id,
    })
    promisesArray.push(updatedBlog.save())
  }
  await Promise.all(promisesArray)

  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  token = result.body.token
})

test('blogs returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('verify that the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body

  assert('id' in blogs[0])
  assert.strictEqual(blogs[0]._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Node is amazing',
    author: 'John Doe',
    url: 'http://nodeisamazing.com',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const contents = response.body.map((b) => b.title)

  assert(contents.includes('Node is amazing'))
})

test('verifies that missing likes property will default to the value 0', async () => {
  const newBlog = {
    title: 'Node is amazing',
    author: 'John Doe',
    url: 'http://nodeisamazing.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blog = response.body.find((blog) => blog.title === newBlog.title)
  assert.strictEqual(blog.likes, 0)
})

describe('handles missing data correctly', () => {
  test('missing title', async () => {
    const missingTitleBlog = {
      author: 'John Doe',
      url: 'http://nodeisamazing.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(missingTitleBlog)
      .set('authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('missing url', async () => {
    const missingUrlBlog = {
      title: 'Node is amazing',
      author: 'John Doe',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(missingUrlBlog)
      .set('authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const blogTitles = blogsAtEnd.body.map((blog) => blog.title)
    assert(!blogTitles.includes(blogToDelete.title))
  })
})

describe('updating contents of a blog', () => {
  test.only('succeds with status code 204 if id is valid', async () => {
    const newLikes = 30
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const blogUpdatedContent = {
      ...blogToUpdate,
      user: blogToUpdate.user.id,
      likes: newLikes,
    }
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdatedContent)
      .set('authorization', `Bearer ${token}`)
    assert.strictEqual(updatedBlog.body.likes, 30)
  })
})

after(async () => {
  await mongoose.connection.close()
})
