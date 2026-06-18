const getUser = () => {
  return window.localStorage.getItem('loggedBlogappUser')
}

const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
}

export {
  getUser,
  saveUser,
  removeUser
}