const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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

router.post('/', async (request, response /*,next*/) => {
  const body = request.body
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    votes: Number(body.votes || '0')
  })

  //try {
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
  //} catch(error) { next(error) }
})

router.delete('/:id', async (request, response /*,next*/) => {
  //try {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  //} catch(error) { next(error) }
})

router.put('/:id', async (request, response /*,next*/) => {
  const body = request.body

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    votes: Number(body.votes || '0')
  })

  //try {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, blog, { new: true })
  response.json(updatedBlog)
  //} catch(error) { next(error) }
})

module.exports = router