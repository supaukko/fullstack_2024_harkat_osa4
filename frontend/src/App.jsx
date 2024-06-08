import { useState, useEffect } from 'react'
import blogService from './services/blog'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Filter from './components/Filter'
import Notification from './components/Notification'

const defaultBlogData = {
  author: '',
  title: '',
  url: '',
  votes: 0,
  id: null
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogData, setBlogData] = useState({...defaultBlogData});
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

  /**
   * Handle change 
   * @param {*} event 
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogData({
      ...blogData,
      [name]: value
    });
  }

  /**
   * Clear blog data 
   */
  const handleClear = (event) => {
    console.log('handleClear..')
    event.preventDefault()
    setBlogData({...defaultBlogData});
  }

    /**
   * handleRowSelect
   * @param {*} blog
   */
  const handleRowSelect = (blog) => {
    console.log('handleRowSelect', blog)
    setBlogData({...blog});
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    // Check if the block should be updated
    if (blogData.id !== null || blogData.id?.trim() === '') {
      console.log('handleSubmitBlog - update', blogData)
      blogService.update(blogData.id, blogData)
      blogService.create(blogData)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => (blog.id === blogData.id ? {...blogData} : blog)))
        showNotification(`Updated ${returnedBlog.author}`, style.notification)
        setBlogData({...defaultBlogData});
      })
      .catch(error => {
        showNotification(error.response.data.error, style.error)
      })
      return
    }
    console.log('handleSubmitBlog - add', blogData)
    // Add new a blog
    blogService.create(blogData)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification(`Added ${returnedBlog.author}`, style.notification)
        setBlogData({...defaultBlogData});
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

  /**
   * Handle delete
   * @param {*} id 
   */
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

      <BlogForm
        blogData={blogData}
        handleSubmit={handleSubmitBlog}
        handleChange={handleChange} 
        handleClear={handleClear} />

      <h2>Blogit</h2>
      <Blogs
        blogs={filteredBlogs}
        handleDelete={handleDelete}
        blogData={blogData}
        handleRowSelect={handleRowSelect} />
    </div>
  )
}

export default App