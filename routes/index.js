const router = require('express').Router();
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

router.use('/signin', signInRouter);
router.use('/signup', signUpRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.all('*', (req, res, next) => {
  return next(new NotFoundError('Неверный адрес'));
});

module.exports = router;
