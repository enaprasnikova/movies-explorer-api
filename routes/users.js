const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserInfo); // возвращает информацию о пользователе (email и имя)

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;
