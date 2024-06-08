const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')

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

/**
 * Check token and set decoded user data
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const jwtToken = async (request, response, next) => {
  const authorization = request.get('authorization')
  const token = authorization && authorization.split(' ')[1]

  if (!token) {
    logger.info('** jwtToken 401')
    return response.status(401).json({ message: 'Access denied' })
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    request.token = decodedToken
    next()
  } catch (error) {
    logger.info('** jwtToken 400', error.message)
    response.status(403).json({ message: `Invalid token ${error.message}` })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  jwtToken
}