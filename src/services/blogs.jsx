import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)

  return response.data
}

export const updateLikes = async (blog) => {
  const config = {
    headers : { Authorization : token },
  }

  const updatedBlog = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return updatedBlog.data
}

export const deleteBlog = async (id) => {
  const config = {
    headers : { Authorization : token }
  }

  await axios.delete(`${baseUrl}/${id}`, config)

}

export default { getAll, create, setToken, updateLikes, deleteBlog }