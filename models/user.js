const mongoose = require('mongoose')

/**
 * User-skeema, riippuvuus userin blogeihin
 * Mongoosen populate-funktion toiminnallisuus perustuu siihen, että
 * on viitteiden "tyypit" on määritelty olioiden Mongoose-skeemaan
 * ref-kentän avulla
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User