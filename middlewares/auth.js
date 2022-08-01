const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { PERMISSION_DENIED } = require('../utils/responses');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(PERMISSION_DENIED);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(PERMISSION_DENIED);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
