const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { PORT } = require('./constants/constants');
const router = require('./routes/index');
const { defaultErrorHandler } = require('./middlewares/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errors());

app.use(defaultErrorHandler);

app.listen(PORT);
