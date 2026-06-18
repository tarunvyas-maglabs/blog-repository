const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  if (!(username && password)) {
    return response
      .status(400)
      .json({ error: 'username or password is missing' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be atleast 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findById(id).populate('blogs', {
    title: 1,
  })

  response.json(user)
})

module.exports = usersRouter
