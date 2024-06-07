const mongoose = require('mongoose')

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