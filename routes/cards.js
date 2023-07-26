const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { URL_REGEX } = require('../constants/constants');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(URL_REGEX, 'url'),
    }),
  }, {
    messages: {
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.pattern.name': 'Формат ссылки поля {#label} не соответствует шаблону {#name}',
      'string.min': 'Длина поля {#label} должна быть не менее {#limit} символов',
      'string.max': 'Длина поля {#label} должна быть не более {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }, {
    messages: {
      'string.hex': 'Параметр {#label} должен состоять из латинских букв или цифр',
      'string.length': 'Параметр {#label} должен иметь длину {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }, {
    messages: {
      'string.hex': 'Параметр {#label} должен состоять из латинских букв или цифр',
      'string.length': 'Параметр {#label} должен иметь длину {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }, {
    messages: {
      'string.hex': 'Параметр {#label} должен состоять из латинских букв или цифр',
      'string.length': 'Параметр {#label} должен иметь длину {#limit} символов',
      'any.required': 'Поле {#label} является обязательным',
    },
  }),
  dislikeCard,
);

module.exports = router;
