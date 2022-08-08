const express = require('express');

require('dotenv').config();

const helmet = require('helmet');

const { PORT = 3001 } = process.env;

const { URL_MONGO, NODE_ENV } = process.env;

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const cors = require('cors');

const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { errorHandler } = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const UnknownPathError = require('./errors/unknownPath');
const { UNKNOWN_PATH_MESSAGE } = require('./utils/responses');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? URL_MONGO : 'mongodb://localhost:27017/moviesdb');

app.use(helmet());

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://movies.evnap.nomoredomains.xyz',
    'https://movies.evnap.nomoredomains.xyz',
    'http://api.movies.evnap.nomoredomains.xyz',
    'https://api.movies.evnap.nomoredomains.xyz',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

app.use('*', cors(options)); // Подключаем первой миддлварой

app.use(requestLogger);

app.use(router);

app.use(auth, (req, res, next) => {
  next(new UnknownPathError(UNKNOWN_PATH_MESSAGE));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
