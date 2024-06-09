const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const parseError = (error) => {
  return { error: `${error.name}: ${error.message}` }
}
const errorHandler = (error, request, response, next) => {
  logger.error('errorHandler:', error.name, error.message)

  if (error.name === 'CastError' || error.name === 'ValidationError'
    || error.name === 'MongoServerError') {
    return response.status(400).send(parseError(error))
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const parseToken = (request) => {
  const result = {
    token: null,
    status: null,
    message: null
  }
  const authorization = request.get('authorization')
  const token = authorization && authorization.split(' ')[1]

  if (!token) {
    result.status = 401
    result.message = 'Access denied'
    return result
  }

  try {
    result.token = jwt.verify(token, config.SECRET)
  } catch (error) {
    result.status = 403
    result.message = `Invalid token ${error.message}`
  }
  return result
}

const tokenExtractor = async (request, response, next) => {
  const result = parseToken(request)
  if (result.message) {
    return response.status(result.status).json({ message: result.message })
  }
  request.token = result.token
  next()
}

const userExtractor = async (request, response, next) => {
  const result = parseToken(request)
  if (result.message) {
    return response.status(result.status).json({ message: result.message })
  }
  const user =  await User.findById(result.token.id)
  request.user = user
  next()
}

/**
 * Väliaikaiseen testikäyttöön tarkoitettu middleware, joka
 * lisää tokenin headeriin
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const dummyAuthorizationInsertion = async (request, response, next) => {

  const authorization = request.headers['authorization']
  if (config.ENV !== 'test' && (authorization === undefined ||
    !authorization.startsWith('Bearer '))) {
    const users = await User.find({})
    if (users !== null && users.length) {
      const user = users[0]
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        config.SECRET,
        { expiresIn: Number(config.TOKEN_EXPIRES_IN) }
      )
      request.headers['authorization'] = `Bearer ${token}`
    }
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  dummyAuthorizationInsertion
}