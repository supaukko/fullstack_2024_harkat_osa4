require('dotenv').config()

const SECRET = process.env.SECRET
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  TOKEN_EXPIRES_IN,
  ENV: process.env.NODE_ENV
}