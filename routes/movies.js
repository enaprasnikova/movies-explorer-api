const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMovies,
  createMovie,
  deleteCard,
} = require('../controllers/movies');

router.get('/', getUserMovies); // возвращает все сохранённые текущим  пользователем фильмы

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailerLink: Joi.string().required().uri(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().uri(),
    movieId: Joi.string().required().hex().length(24),
  }),
}), createMovie); // создаёт фильм

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteCard); // удаляет сохранённый фильм по id

module.exports = router;
