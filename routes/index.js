const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const signOutRouter = require('./signout');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    'Поступило слишком много запросов на создание аккаунта с этого IP, повторите операцию через 1 час',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use('/', limiter);

router.use('/signin', signInRouter);
router.use('/signup', createAccountLimiter);
router.use('/signup', signUpRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/signout', signOutRouter);

router.all('*', (req, res, next) => next(new NotFoundError('Неверный адрес')));

module.exports = router;
