const router = require('express').Router();

router.get('/', (req, res) => {
  res.clearCookie('token').send({ message: 'Выход' });
});

module.exports = router;
