import { useState } from 'react'

const Blog = ({ blog, likeBlogMutation, deleteBlogMutation, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)


  const toggleVisibility = () => {
    setBlogVisible(!blogVisible)
  }

  const removeMutation = (blog) => {
    if(confirm(`Do you want to remove blog "${blog.title} by ${blog.author}"?`)) {
      deleteBlogMutation.mutate(blog)
    }
  }

  const border = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={border} className="Blog">
      <div >
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{blogVisible ? 'hide' : 'View'}</button>
        {blogVisible &&
        <div className="hidden">
          <div> {blog.url} </div>
          <div>Likes : {blog.likes} <button onClick={() => likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id })}>like</button></div>
          <div>{blog.user.username}</div>
          { user.username === blog.user.username &&
            <div><button id="blog-remove-button" onClick={() => removeMutation(blog)}>remove</button></div>}
        </div>}
      </div>
    </div>
  )
}


export default Blog
