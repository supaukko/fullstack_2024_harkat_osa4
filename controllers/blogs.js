const router = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
*/

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

/**
 * express-async-errors kirjaston ansiosta erillisiä try-catch lohkoja
 * ei tarvita. Myös next(error) funktion kutsuminen hoituu virhetilanteessa
 * tämän kirjaton avulla
 */
router.get('/:id', async (request, response /*,next*/) => {
  //§try {
  const blog =  await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
  //} catch(error) { next(error) }
})

router.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response /*,next*/) => {

    if (request.token === null || request.token.id === null) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return response.status(400).json({ message: 'Invalid user ID' })
    }
    //const user = await User.findById(body.userId)
    const body = request.body
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      votes: Number(body.votes || '0'),
      user: user._id
    })

    //try {
    const savedBlog = await blog.save()

    // Lisätään käyttäjälle referenssi lisättyyn blogiin
    if (user) {
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }
    console.log(`router.post - new blog id=${savedBlog._id}, user's block count=${user?.blogs?.length} kpl`)

    response.status(201).json(savedBlog)
  //} catch(error) { next(error) }
  })

router.delete('/:id',
  tokenExtractor,
  userExtractor,
  async (request, response /*,next*/) => {
  //try {
    const blogId = request.params.id
    const userId = request.user._id
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return response.status(400).json({ message: 'Invalid blog ID' })
    }

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return response.status(404).json({ message: 'Blog not found' })
    }

    if (blog.user.toString() !== userId.toString()) {
      return response.status(403).json(
        { message: 'No authorization to delete the blog' })
    }

    await blog.deleteOne()
    response.status(204).end()
  //} catch(error) { next(error) }
  })

router.put('/:id', async (request, response /*,next*/) => {
  //try {
  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).send({ error: 'Invalid ObjectId' })
  }
  // findByIdAndUpdate -metodiT heittää MongooseError virheen: Cast to ObjectId failed for value
  // §(type Object) at path User because of "BSONError"
  //const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ message: 'Blog not found' })
  }
  blog.author = request.body.author
  blog.title = request.body.title
  blog.url = request.body.url
  blog.votes = request.body.votes
  await blog.save()
  const updatedBlog = await Blog.findById(request.params.id)
  response.status(200).json(updatedBlog)
  //} catch(error) { next(error) }
})

module.exports = router