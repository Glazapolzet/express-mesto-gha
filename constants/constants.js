const { PORT = 3000 } = process.env;
const JWT_SECRET = '9de16daab3f85330cef9ddbd2915b74dd2d3aad3fa8e6f91f845ac23e5158c6b';

const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const NOT_FOUND_STATUS_CODE = 404;
const CONFLICT_STATUS_CODE = 409;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

module.exports = {
  PORT,
  JWT_SECRET,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
};
