import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const result = await axios.post(baseUrl, credentials)
  return result.data
}

export default {
  login,
}
