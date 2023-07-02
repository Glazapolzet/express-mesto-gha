const mongoose = require('mongoose');
const User = require('../models/user');
const { BAD_REQUEST_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require('../constants/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Передан некорректный _id пользователя' });
        return;
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }

      next(err);
    });
};

const updateProfileInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((profileInfo) => {
      if (!profileInfo) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }

      res.send(profileInfo);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }

      next(err);
    });
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((profileAvatar) => {
      if (!profileAvatar) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }

      res.send(profileAvatar);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }

      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
};
