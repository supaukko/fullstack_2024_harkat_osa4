const  bcryptjs = require('bcryptjs')
const router = require('express').Router()
const User = require('../models/user')

/**
 * Lisätään user
 */
router.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (password === null || password.trim().length < 3) {
    return response.status(400).json({ error: 'Validation error: password too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

/**
 * Haetaan userit ja populoidaan niihin liittyvät
 * blogit mukaan.
 * Mongoosen populate-funktion toiminnallisuus perustuu siihen, että
 * on viitteiden "tyypit" on määritelty olioiden Mongoose-skeemaan
 * ref-kentän avulla

 */
router.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { author: 1, title: 1, url: 1, votes: 1 })
  response.json(users)
})

router.delete('/:id', async (request, response /*,next*/) => {
  //try {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
  //} catch(error) { next(error) }
})

router.put('/:id', async (request, response /*,next*/) => {
  //try {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true })
  if (!user) {
    return response.status(404).json({ message: 'User not found' })
  }
  response.status(200).json(user)
  //} catch(error) { next(error) }
})
module.exports = router