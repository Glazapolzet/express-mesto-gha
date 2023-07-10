const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, updateProfileInfo, updateProfileAvatar, getProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getProfile);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.min': 'Длина поля {#label} должна быть не менее {#limit} символов',
      'string.max': 'Длина поля {#label} должна быть не более {#limit} символов',
    },
  }),
  updateProfileInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri(),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.uri': 'Неверный формат ссылки у поля {#label}',
    },
  }),
  updateProfileAvatar,
);

router.get('/:userId', getUser);

module.exports = router;
