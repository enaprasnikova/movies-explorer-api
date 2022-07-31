const express = require('express');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const UserRoutes = require('./routes/users');
const MovieRoutes = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  STATUS_INTERNAL_ERROR,
} = require('./utils/statusCodes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

app.use('/users', auth, UserRoutes);

app.use('/movies', auth, MovieRoutes);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(STATUS_INTERNAL_ERROR).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
