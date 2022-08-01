const { STATUS_INTERNAL_ERROR } = require('../utils/statusCodes');
const { INTERNAL_ERROR } = require('../utils/responses');

module.exports.errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(STATUS_INTERNAL_ERROR).send({ message: INTERNAL_ERROR });
};
