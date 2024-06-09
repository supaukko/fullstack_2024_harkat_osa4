const Blog = require('../models/blog')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    votes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    votes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    votes: 12
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blogs => blogs.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createPasswdHash = async(passwd) => {
  return await bcryptjs.hash(passwd, 10)
}

const addUserAndBlocks = async (userData, blocksData) => {
  // Create user
  const hash = await createPasswdHash(userData.password)
  const user = new User({
    username: userData.username,
    name: userData.name,
    passwordHash: hash })
  const savedUser = await user.save()

  // Create blogs
  for (const blog of blocksData) {
    const obj = new Blog(
      {
        ...blog,
        user: savedUser._id
      })
    const savedObj = await obj.save()
    savedUser.blogs = savedUser.blogs.concat(savedObj._id)
  }
  await savedUser.save()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  createPasswdHash,
  addUserAndBlocks
}