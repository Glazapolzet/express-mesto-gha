const { ALLOWED_ORIGINS } = require('../constants/constants');

module.exports = (req, res, next) => {
  const { origin } = req.headers;

  const { method } = req;

  const requestHeaders = req.headers['access-control-request-headers'];

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set({
      'Access-Control-Allow-Origin': origin,
      // 'Access-Control-Allow-Credentials': 'true',
    });
  }

  if (method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Headers': requestHeaders,
    });
    return res.end();
  }

  next();
};
