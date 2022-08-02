const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const UserRoutes = require('./users');
const auth = require('../middlewares/auth');
const MovieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');

router.use('/users', auth, UserRoutes);
router.use('/movies', auth, MovieRoutes);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = router;
