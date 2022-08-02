const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getUserMovies,
  createMovie,
  deleteCard,
} = require('../controllers/movies');

const { TRAILERLINK_IS_NOT_CORRECT, THUMBNAIL_IS_NOT_CORRECT, IMAGE_IS_NOT_CORRECT } = require('../utils/responses');

router.get('/', getUserMovies); // возвращает все сохранённые текущим  пользователем фильмы

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(IMAGE_IS_NOT_CORRECT);
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(TRAILERLINK_IS_NOT_CORRECT);
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(THUMBNAIL_IS_NOT_CORRECT);
    }),
    movieId: Joi.number().required(),
  }),
}), createMovie); // создаёт фильм

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), deleteCard); // удаляет сохранённый фильм по id

module.exports = router;
