const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, updateProfileInfo, updateProfileAvatar, getProfile,
} = require('../controllers/users');
const { URL_REGEX } = require('../constants/constants');

router.get('/', getUsers);

router.get('/me', getProfile);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.min': 'Длина поля {#label} должна быть не менее {#limit} символов',
      'string.max': 'Длина поля {#label} должна быть не более {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  updateProfileInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(URL_REGEX, 'url').required(),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.pattern.name': 'Формат ссылки поля {#label} не соответствует шаблону {#name}',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  updateProfileAvatar,
);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }, {
    messages: {
      'string.hex': 'Параметр {#label} должен состоять из латинских букв или цифр',
      'string.length': 'Параметр {#label} должен иметь длину {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  getUser,
);

module.exports = router;
