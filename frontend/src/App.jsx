import { useState, useEffect } from 'react'
import blogService from './services/blog'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogData, setBlogData] = useState({
    author: '',
    title: '',
    url: '',
    votes: 0
  });
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)

  const style = {
    notification: 'notification',
    error: 'error'
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
        setBlogs(blogs)
      })
  }, [])

  const filteredBlogs = blogs?.filter(blog =>
    blog.author?.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogData({
      ...blogData,
      [name]: value
    });
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    blogService.create(blogData)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification(`Added ${returnedBlog.author}`, style.notification)
        setBlogData({
          author: '',
          title: '',
          url: '',
          votes: 0
        });
      })
      .catch(error => {
        showNotification(error.response.data.error, style.error)
      })
  }

  const showNotification = (msg, style) => {
    setNotificationStyle(style)
    setNotificationMessage(msg)

    setTimeout(() => {
      setNotificationStyle(null)
      setNotificationMessage(null)
    }, 5000)
  }

  const handleDelete = (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Delete ${blog.title} ?`)) {
      blogService.remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          showNotification(`Deleted ${blog.title}`, style.notification)
        })
    }
  }

  if (filteredBlogs === null) {
    return null
  }

  return (
    <div>
      <Notification message={notificationMessage} style={notificationStyle} />
      <h2>Blogilista</h2>
      <Filter filter={filter} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <BlogForm
        blogData={blogData}
        handleSubmit={handleSubmitBlog}
        handleChange={handleChange} />

      <h2>Blogit</h2>
      <Blogs blogs={filteredBlogs} handleDelete={handleDelete} />
    </div>
  )
}

export default App