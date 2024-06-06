const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const oneTestBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    votes: 5,
    __v: 0
  },
]
const testBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    votes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    votes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    votes: 12,
    __v: 0
  }
]

describe('Tehtavat 4.1 - 4.4', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

  test('totalLikes multiple blogs - 24 likes', () => {
    const result = listHelper.totalLikes(testBlogs)
    assert.strictEqual(result, 24)
  })

  test('totalLikes one blog - 5 likes', () => {
    const result = listHelper.totalLikes(oneTestBlog)
    assert.strictEqual(result, 5)
  })

  test('totalLikes empty blog array - 0 likes ', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('Tehtavat 4.5', () => {
  const expectedResult = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    votes: 12 }

  test('favoriteBlog find one blog from a list of blocks', () => {
    const result = listHelper.favoriteBlog(testBlogs)
    assert.deepStrictEqual(expectedResult, result)
  })

  test('favoriteBlog thows exception if paramter is not array', () => {
    assert.throws(() => listHelper.favoriteBlog(expectedResult), TypeError)
  })
})

describe('Tehtavat 4.6', () => {
  const expectedResult = {
    author: 'Edsger W. Dijkstra',
    blogs: 2 }

  test('mostBlogs find author with the most blocks', () => {
    const result = listHelper.mostBlogs(testBlogs)
    assert.deepStrictEqual(expectedResult, result)
  })
})

describe('Tehtavat 4.7', () => {
  const expectedResult = {
    author: 'Edsger W. Dijkstra',
    likes: 17 }

  test('mostLikes find author with the most likes', () => {
    const result = listHelper.mostLikes(testBlogs)
    assert.deepStrictEqual(expectedResult, result)
  })
})