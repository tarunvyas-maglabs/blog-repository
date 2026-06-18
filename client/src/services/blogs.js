import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async (blogId, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, updatedBlog)
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

const commentOnBlog = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, comment)
  return response.data
}

export default { getAll, setToken, create, updateLikes, deleteBlog, commentOnBlog }
