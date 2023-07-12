const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }

      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      if (card.owner.id !== userId) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }

      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.send(deletedCard))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }

      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      res.send(card.likes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }

      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((likes) => {
      if (!likes) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      res.send(likes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }

      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
