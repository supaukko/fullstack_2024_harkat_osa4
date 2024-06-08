import Blog from './Blog'

const Blogs = ({blogs, handleDelete, blogData, handleRowSelect}) => {
  return (
    <table>
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
            handleDelete={handleDelete}
            blogData={blogData}
            handleRowSelect={handleRowSelect} />)
      }
      </tbody>
    </table>
  )
}

export default Blogs