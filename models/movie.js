const mongoose = require('mongoose');

const { Types } = require('mongoose');

const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validator: (link) => validator.isURL(link),
  },
  trailerLink: {
    type: String,
    required: true,
    validator: (link) => validator.isURL(link),
  },
  thumbnail: {
    type: String,
    required: true,
    validator: (link) => validator.isURL(link),
  },
  owner: {
    type: Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
