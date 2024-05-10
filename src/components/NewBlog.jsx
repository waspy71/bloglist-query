import { useState } from 'react'

const NewBlog = ({ createBlogMutation }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlog = async (event) => {
    event.preventDefault()

    createBlogMutation.mutate({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleBlog}>
        <div>
                title
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                author
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
                url
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button className="blog-create-button" type="submit">Create</button>
      </form>
    </div>

  )
}

export default NewBlog