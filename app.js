const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT, INTERNAL_SERVER_ERROR_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require('./constants/constants');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '649e8f63dd7b9cb896b43e0b',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: 'Неверный адрес' });
});

app.use((err, req, res, next) => {
  res
    .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    .send({ message: 'Возникла проблема с сервером' });

  next();
});

app.listen(PORT);
