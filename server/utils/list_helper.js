const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map((blog) => blog.likes).reduce((sum, curr) => sum + curr, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authors = blogs.map((blog) => blog.author)

  const uniqueAuthors = [...new Set(authors)]

  const listOfAuthorAndBlogCount = []

  for (const author of uniqueAuthors) {
    const count = blogs.filter((blog) => blog.author === author).length
    listOfAuthorAndBlogCount.push({ author: author, blogs: count })
  }

  return listOfAuthorAndBlogCount.sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author)

  const uniqueAuthors = [...new Set(authors)]

  const listOfAuthorAndLikes = []

  for (const author of uniqueAuthors) {
    const likes = blogs
      .filter((blog) => blog.author === author)
      .reduce((sum, curr) => sum + curr.likes, 0)
    listOfAuthorAndLikes.push({ author: author, likes: likes })
  }

  return listOfAuthorAndLikes.sort((a, b) => b.likes - a.likes)[0]
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
