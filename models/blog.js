const mongoose = require('mongoose')

/**
 * Blogin skeema, riippuvuus useriin
 * Mongoosen populate-funktion toiminnallisuus perustuu siihen, että
 * on viitteiden "tyypit" on määritelty olioiden Mongoose-skeemaan
 * ref-kentän avulla
 */
const blogSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value !== null || value.trim() !== ''
      }, message: 'Invalid title'
    }
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value !== null || value.trim() !== ''
      }, message: 'Invalid URL'
    }
  },
  votes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)