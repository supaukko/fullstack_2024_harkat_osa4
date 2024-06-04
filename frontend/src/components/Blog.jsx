const Blog = ({blog, handleDelete}) => {
  return (
    <tr>
      <td>{blog.author}</td>
      <td>{blog.title}</td>
      <td>{blog.url}</td>
      <td>{blog.votes}</td>
      <td>
        <button onClick={() => handleDelete(blog.id)}>Delete</button>
      </td>
    </tr>
  )
}

export default Blog