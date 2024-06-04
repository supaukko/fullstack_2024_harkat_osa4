import Blog from './Blog'

const Blogs = ({blogs, handleDelete}) => {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Kirjoittaja</th>
          <th>Aihe</th>
          <th>URL</th>
          <th>Äänimäärä</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {
        blogs.map(blog => <Blog
            key={blog.id}
            blog={blog}
            handleDelete={handleDelete} />)
      }
      </tbody>
    </table>
  )
}

export default Blogs