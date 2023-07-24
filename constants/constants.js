const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=]*)$/;

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const NOT_FOUND_STATUS_CODE = 404;
const CONFLICT_STATUS_CODE = 409;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

const ALLOWED_ORIGINS = [
  'http://vypz.praktikum.nomoredomains.xyz',
  'https://vypz.praktikum.nomoredomains.xyz',
  'http://localhost:3001',
  'http://localhost:3000',
];

module.exports = {
  URL_REGEX,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  ALLOWED_ORIGINS,
};
