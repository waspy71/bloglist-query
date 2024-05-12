import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const config = () => {
  return  {
    headers: {
      Authorization: localStorage.getItem('loggedBlogappUser')
        ? `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
        : null
    }
  }
}


export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const create = async newBlog => {

  const response = await axios.post(baseUrl, newBlog, config())

  return response.data
}

export const updateLikes = async (blog) => {

  const updatedBlog = await axios.put(`${baseUrl}/${blog.id}`, blog, config())
  return updatedBlog.data
}

export const deleteBlog = async (id) => {

  await axios.delete(`${baseUrl}/${id}`, config())

}

export default { getAll, create, updateLikes, deleteBlog }