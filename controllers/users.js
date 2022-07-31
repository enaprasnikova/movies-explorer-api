const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidatorError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');

const SALT_ROUNDS = 10;
const { JWT_SECRET, NODE_ENV } = process.env;
const {
  STATUS_SUCCESS_CREATED,
  MONGO_DUPLICATE_ERROR_CODE,
  STATUS_UNAUTHORIZED_ERROR,
} = require('../utils/statusCodes');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new ValidatorError('Не передан емейл или пароль');
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_SUCCESS_CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidatorError('Ошибка валидации'));
      }

      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Емейл занят'));
      }

      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidatorError('Не передан емейл или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }

      return Promise.all([
        foundUser,
        bcrypt.compare(password, foundUser.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Неправильный емейл или пароль');
      }

      return jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = STATUS_UNAUTHORIZED_ERROR;
      next(error);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id, '-password -__v')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      fields: '-password -__v',
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidatorError('Некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};
