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

const updateProfile = (fields, validationErrorMessage) => (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    fields,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedFields) => {
      if (!updatedFields) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }

      res.send(updatedFields);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: validationErrorMessage });
        return;
      }

      next(err);
    });
};

const updateProfileInfo = (req, res, next) => {
  const { name, about } = req.body;

  const updateInfo = updateProfile(
    { name, about },
    'Переданы некорректные данные при обновлении профиля',
  );

  updateInfo(req, res, next);
};

const updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;

  const updateAvatar = updateProfile(
    { avatar },
    'Переданы некорректные данные при обновлении аватара',
  );

  updateAvatar(req, res, next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
};
