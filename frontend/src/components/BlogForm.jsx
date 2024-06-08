const BlogForm = ({
    blogData,
    handleSubmit,
    handleChange,
    handleClear}) => {
  console.log('BlogForm', blogData)
  const header = blogData.id !== null && blogData.id.trim() !== '' ?
    'Update' : 'Add a new'
  return (
    <div>
      <h3>{header}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">Kirjoittaja:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={blogData.author}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="title">Otsikko:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={blogData.url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="votes">Äänimäärä:</label>
          <input
            type="text"
            id="votes"
            name="votes"
            value={blogData.votes}
            onChange={handleChange}
          />
        </div>
        <button onClick={(event) => handleClear(event)}>Clear</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default BlogForm