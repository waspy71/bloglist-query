import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  console.log('createBlog', response.data)

  return response.data
}

const updateLikes = async (blog) => {
  const config = {
    headers : { Authorization : token },
  }

  const updatedBlogLikes = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
    user: blog.user.id
  }

  const updatedBlog = await axios.put(`${baseUrl}/${blog.id}`, updatedBlogLikes, config)
  return updatedBlog.data
}

const deleteBlog = async (id) => {
  const config = {
    headers : { Authorization : token }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
  
}

export default { getAll, create, setToken, updateLikes, deleteBlog }