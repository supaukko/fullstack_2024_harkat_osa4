const { app } = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')
const db = require('./utils/db')

db.doConnect()

app.listen(config.PORT, () => {
  logger.info(`Server running on port=${config.PORT}, env=${config.ENV}`)
})