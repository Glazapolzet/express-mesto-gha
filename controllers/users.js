const mongoose = require('mongoose');
const User = require('../models/user');
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require('../constants/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Возникла проблема с сервером' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }

      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Возникла проблема с сервером' });
    });
};

const createUser = (req, res) => {
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

      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Возникла проблема с сервером' });
    });
};

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((profileInfo) => {
      if (!profileInfo) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
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

      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Возникла проблема с сервером' });
    });
};

const updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((profileAvatar) => {
      if (!profileAvatar) {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: 'Запрашиваемый пользователь не найден' });
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

      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Возникла проблема с сервером' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
};
