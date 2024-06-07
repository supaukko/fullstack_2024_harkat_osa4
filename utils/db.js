const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

mongoose.set('strictQuery', false)

const doAsyncConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoDB')
  }
  catch(error) {
    logger.error('error connection to MongoDB:', error.message)
    throw error
  }
}

const doConnect = () => {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connection to MongoDB:', error.message)
      throw error
    })
}

const doAsyncClose = async () => {
  await mongoose.connection.close()
}

module.exports = {
  doAsyncConnect, doConnect, doAsyncClose
}