const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    acc += blog.votes
    return acc
  }, 0)
}

/**
 * Selvitetään millä blogilla on eniten tykkäyksiä. Jos suosikkeja on monta,
 * palautetaan niistä viimeisin
 * @param {*} blogs
 * @returns
 */
const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) {
    throw new TypeError('Parameter is not an array')
  }
  const blog = blogs.reduce((max, obj) => (obj.votes > max.votes ? obj : max), blogs[0])
  return {
    title: blog.title,
    author: blog.author,
    votes: blog.votes
  }
}

/**
 * Etsitään kirjoittaja, jolla on eniten blogeja
 */
const mostBlogs = (blogs) => {
  const authors = _.groupBy(blogs, 'author')
  const authorBlogCount = _.mapValues(authors, (authorBlogs) => authorBlogs.length)
  //console.log('authorBlogCount:', authorBlogCount)
  const author = _.maxBy(_.keys(authorBlogCount), (author) => authorBlogCount[author])
  //console.log('author:', author)
  const result = {
    author,
    blogs: authorBlogCount[author]
  }
  //console.log('result:', result)
  return result
}

/**
 * Etsitään kirjoittaja, jonka blogeilla on eniten tykkäyksiä
 */
const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author')
  const authorVotes = _.mapValues(authors, (authorBlogs) => _.sumBy(authorBlogs, 'votes'))
  //console.log('authorVotes:', authorVotes)
  const author = _.maxBy(_.keys(authorVotes), (author) => authorVotes[author])
  //console.log('author:', author)
  return {
    author,
    likes: authorVotes[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}