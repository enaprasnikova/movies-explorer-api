const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/notFoundError');
const { ForbiddenError } = require('../errors/forbiddenError');
const {
  STATUS_SUCCESS,
  STATUS_SUCCESS_CREATED,
} = require('../utils/statusCodes');

const { ValidatorError } = require('../errors/validationError');

module.exports.getUserMovies = (req, res, next) => {
  const ownerId = req.user._id;

  Movie.find({ owner: ownerId }, '-__v')
    .populate('owner', '-__v')
    .then((movies) => {
      res.status(STATUS_SUCCESS).send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      movie.populate('owner', '-__v')
        .then((populatedMovie) => {
          res.status(STATUS_SUCCESS_CREATED).send({
            _id: populatedMovie._id,
            country: populatedMovie.country,
            director: populatedMovie.director,
            duration: populatedMovie.duration,
            year: populatedMovie.year,
            description: populatedMovie.description,
            image: populatedMovie.image,
            trailerLink: populatedMovie.trailerLink,
            nameRU: populatedMovie.nameRU,
            nameEN: populatedMovie.nameEN,
            thumbnail: populatedMovie.thumbnail,
            movieId: populatedMovie.movieId,
            owner: populatedMovie.owner,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new ValidatorError('Некорректные данные при создании фильма'));
          }
          return next(err);
        });
    });
};

module.exports.deleteCard = (req, res, next) => {
  Movie.findById(req.params.id, '-__v')
    .populate('owner', '-__v')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }

      if (req.user._id !== movie.owner.id.toString()) {
        throw new ForbiddenError('Нет прав на удаление фильма');
      }
      return movie;
    })
    .then((movie) => movie.remove())
    .then((movie) => {
      res.status(STATUS_SUCCESS).send(movie);
    })
    .catch(next);
};
