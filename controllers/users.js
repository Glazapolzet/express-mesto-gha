const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET } = require('../constants/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (userId) => (req, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }

      return next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  const getSpecifiedUser = getUserById(userId);

  getSpecifiedUser(req, res, next);
};

const getProfile = (req, res, next) => {
  const { _id: userId } = req.user;

  const getSpecifiedProfile = getUserById(userId);

  getSpecifiedProfile(req, res, next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send(user.toObject({ useProjection: true })))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          }

          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }

          return next(err);
        })
        .catch(next);
    });
};

const updateProfile = (fields, validationErrorMessage) => (req, res, next) => {
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    fields,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedFields) => {
      if (!updatedFields) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.send(updatedFields);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(validationErrorMessage));
      }

      return next(err);
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('token', token, {
          maxAge: 604800,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getProfile,
  updateProfileInfo,
  updateProfileAvatar,
  login,
};
