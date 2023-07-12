const { PORT = 3000 } = process.env;
const JWT_SECRET = '9de16daab3f85330cef9ddbd2915b74dd2d3aad3fa8e6f91f845ac23e5158c6b';
// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=]*)$/;

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const NOT_FOUND_STATUS_CODE = 404;
const CONFLICT_STATUS_CODE = 409;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

module.exports = {
  PORT,
  JWT_SECRET,
  URL_REGEX,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
};
