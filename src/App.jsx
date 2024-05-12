import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import blogService, { getAll, create, updateLikes, deleteBlog } from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useNotify } from './reducers/notificationReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserLogout, useUserSet, useUserValue } from './reducers/userReducer'


const App = () => {
  const user = useUserValue()
  const setUser = useUserSet()
  const clearUser = useUserLogout()

  const blogsData = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const blogFormRef = useRef()
  const notificationHandler = useNotify()
  const queryClient = useQueryClient()

  useEffect(() => {
    setUser()
  },[])

  const createBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (blog) => {
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.concat(blog))
      notificationHandler(`New blog ${blog.title} by ${blog.author} added`)
      blogFormRef.current.toggleVisibility()
    },
    onError: (error) => {
      notificationHandler(error.response.data.error, 'error')
    }
  })

  const likeBlogMutation = useMutation({
    mutationFn: updateLikes,
    onSuccess: (blog) => {
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.map(b => b.id === blog.id ? blog : b))
      notificationHandler(`A like for blog ${blog.title} by ${blog.author}`)
    },
    onError: (error) => {
      notificationHandler(error.response.data.error, 'error')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => deleteBlog(blog.id),
    onSuccess: (_, blog) => {
      const staleBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], staleBlogs.filter(b => b.id !== blog.id))
      notificationHandler(`Blog ${blog.title} removed`)
    },
    onError: (error) => {
      notificationHandler(error.response.data.error, 'error')
    }
  })

  const logoutUser = () => {
    clearUser()
  }

  const blogForm = () => (
    <div className='blog-list'>
      <br></br>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlogMutation={likeBlogMutation}
          deleteBlogMutation={deleteBlogMutation}
          user={user}
        />)}
    </div>
  )

  if (blogsData.isPending) {
    return <div>Blogs not available</div>
  } else if (blogsData.isError) {
    return <div>Error: {blogsData.error.message}</div>
  }

  const blogs = blogsData.data

  return (
    <div>
      <Notification />
      { user === null &&
      <LoginForm notificationHandler={notificationHandler} /> }
      {user !== null &&
      <div>
        <h2>Blogs</h2>
        {user.username} logged in
        <button onClick={logoutUser}>logout</button>
        <Togglable buttonLabel='Create blog' ref={blogFormRef}>
          <NewBlog createBlogMutation={createBlogMutation} />
        </Togglable>
        {blogForm()}
      </div>}
    </div>
  )
}

export default App