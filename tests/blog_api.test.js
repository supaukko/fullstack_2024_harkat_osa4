const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
//const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const { app } = require('../app')
const db = require('../utils/db')
const bcryptjs = require('bcryptjs')
const api = supertest(app)

const testUser = {
  username: 'root',
  name: 'Root',
  password: 'passwd',
  id: null,
  passwordHash: null,
  token: null
}

before(async () => {
  await db.doAsyncConnect()
})

beforeEach(async () => {
  // Clear and initialize users
  await User.deleteMany({})

  // Create password hash
  testUser.passwordHash = await bcryptjs.hash(testUser.password, 10)

  // Create user
  const user = new User({
    username: testUser.username,
    name: testUser.name,
    passwordHash: testUser.passwordHash })
  const savedUser = await user.save()

  // Login and get token
  const loginResponse = await api.post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  testUser.token = loginResponse.body.token

  // Clear and initialize blogs
  await Blog.deleteMany({})
  for (const blog of helper.initialBlogs) {
    const obj = new Blog(
      {
        ...blog,
        user: savedUser._id
      })
    const savedObj = await obj.save()
    savedUser.blogs = savedUser.blogs.concat(savedObj._id)
  }
  await savedUser.save()
})

after(async () => {
  // await mongoose.connection.close()
  await db.doAsyncClose()
})

describe('Tehtavat 4.8 - 4.12', () => {
  describe('GET /api/blogs', () => {
    test('Should get correct number of objects', async () => {
    // Act
      const response = await api.get('/api/blogs')

      // Assert
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('Should have `id` identifier field', async () => {
      const response = await api.get('/api/blogs')
      response.body.forEach(blog => {
        assert.strictEqual(
          Object.prototype.hasOwnProperty.call(blog, 'id'),
          true, `Document ${JSON.stringify(blog)} does not have an 'id' property`)
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('Should add blog', async () => {
    // Arrange
      const newBlog = {
        title: 'Test title',
        author: 'Test author',
        url: 'https://foo.bar.com/',
        votes: 1
      }

      // Act
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${testUser.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Assert
      const response = await api.get('/api/blogs')
      const authors = response.body.map(r => r.author)
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(authors.includes(newBlog.author))
    })

    test('Shoud have default value `0` for the `likes`', async () => {
    // Arrange
      const newBlog = {
        title: 'Test title',
        author: 'Test author',
        url: 'https://foo.bar.com/',
        votes: null
      }

      // Act
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Assert
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(response.body.every(blog => blog['votes'] !== null))
    })

    test('Should return status 400 if no `author` or `URL`', async () => {
    // Arrange
      const newBlog = {
        author: 'Test author',
        votes: 15
      }

      // Act & assert
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
})

describe('Tehtavat 4.13 - 4.14', () => {
  describe('DELETE /api/blogs/:id', () => {
    test('Should delete a blog', async () => {
      // Arrange
      let response = await api.get('/api/blogs')
      const blog = { ...response.body[0] }

      // Act & assert
      await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204)

      response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length - 1)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('Should change blog', async () => {
      // Arrange
      const response = await api.get('/api/blogs')
      const blog = { ...response.body[0] }
      blog.title = blog.title.concat('_changed')

      // Act
      const changedResponse = await api
        .put(`/api/blogs/${blog.id}`)
        .send(blog)
        .expect(200)

      // Assert
      // assert.deepStrictEqual(changedResponse.body, blog)
      assert.strictEqual(changedResponse.body.title, blog.title)
      assert.strictEqual(changedResponse.body.author, blog.author)
      assert.strictEqual(changedResponse.body.url, blog.url)
      assert.strictEqual(changedResponse.body.id, blog.id)
      assert.strictEqual(changedResponse.body.user, blog.user.id)
    })
  })
})

describe('User handling', () => {
  test('Shoud add fresh username', async () => {
    // Arrange
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'joedoe',
      name: 'Joe Doe',
      password: 'passwd',
    }

    // Act
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Assert
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})
