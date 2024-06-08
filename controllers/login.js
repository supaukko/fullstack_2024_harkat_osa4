const jwt = require('jsonwebtoken')
const  bcryptjs = require('bcryptjs')
const router = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcryptjs.compare(password, user.passwordHash)

  console.log(`Login route: username=${user?.name}, passwd correct=${passwordCorrect}`)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const expiresIn = Number(config.TOKEN_EXPIRES_IN)
  const token = jwt.sign(
    userForToken,
    config.SECRET,
    { expiresIn: expiresIn }
  )
  console.log(`Login route: expires=${expiresIn} token=${token}`)
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router