const mongoose = require('mongoose');
const Card = require('../models/card');
const { BAD_REQUEST_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require('../constants/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Передан некорректный _id карточки' });
        return;
      }

      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then(({ likes }) => res.send(likes))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }

      if (err instanceof TypeError) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }

      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((likes) => {
      if (!likes) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }

      res.send(likes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }

      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
