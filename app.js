const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { PORT } = require('./constants/constants');
const router = require('./routes/index');
const { celebrateErrorHandler, defaultErrorHandler } = require('./middlewares/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

// app.use(errors());

app.use(celebrateErrorHandler);
app.use(defaultErrorHandler);

app.listen(PORT);
