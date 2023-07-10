const { isCelebrateError } = require('celebrate');
const BadRequestError = require('../errors/BadRequestError');
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require('../constants/constants');

const celebrateErrorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const [errDetails] = err.details.get('body').details;
    return next(new BadRequestError(errDetails.message));
  }

  next(err);
};

const defaultErrorHandler = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE
        ? 'Возникла проблема с сервером'
        : message,
    });

  next();
};

module.exports = {
  celebrateErrorHandler,
  defaultErrorHandler,
};
