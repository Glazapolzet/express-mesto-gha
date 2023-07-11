const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, updateProfileInfo, updateProfileAvatar, getProfile,
} = require('../controllers/users');
const {URL_REGEX} = require("../constants/constants");

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
      avatar: Joi.string().pattern(URL_REGEX, 'url'),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.pattern.name': 'Формат ссылки поля {#label} не соответствует шаблону {#name}',
    },
  }),
  updateProfileAvatar,
);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }, {
    messages: {
      'string.alphanum': 'Параметр {#label} должен состоять из латинских букв или цифр',
      'string.length': 'Параметр {#label} должен иметь длину {#limit} символов',
    },
  }),
  getUser,
);

module.exports = router;
