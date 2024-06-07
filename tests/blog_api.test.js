const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
//const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { app } = require('../app')
const db = require('../utils/db')
const api = supertest(app)

before(async () => {
  await db.doAsyncConnect()
})

beforeEach(async () => {
  // Clear database
  await Blog.deleteMany({})

  // Save test data to the database
  // await Blog.insertMany(helper.initialBlogs)
  const blogs = helper.initialBlogs.map(blog => {
    return new Blog(blog)
  })
  const promises = blogs.map(blog => {
    blog.save()
  })
  await Promise.all(promises)
})

after(async () => {
  // await mongoose.connection.close()
  await db.doAsyncClose()
})

describe('Tehtavat 4.8 - 4.12', () => {

  test('Should return the correct number of objects', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Should have a blog identifier field named `id`', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.strictEqual(
        Object.prototype.hasOwnProperty.call(blog, 'id'),
        true, `Document ${JSON.stringify(blog)} does not have an 'id' property`)
    })
  })

  test('Should be possible to add a blog', async () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test author',
      url: 'https://foo.bar.com/',
      votes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const authors = response.body.map(r => r.author)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(authors.includes(newBlog.author))
  })

  test('Default value in the likes field should be 0', async () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test author',
      url: 'https://foo.bar.com/',
      votes: null
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(response.body.every(blog => blog['votes'] !== null))
  })

  test('Should be status 400 if the blog has no author or URL', async () => {
    const newBlog = {
      author: 'Test author',
      votes: 15
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

})
