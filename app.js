require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const seedRouter = require('./routes/seed')
const cityRouter = require('./routes/city')
const tagRouter = require('./routes/tag')
const restaurantRouter = require('./routes/restaurant')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/seed', seedRouter);
app.use('/city', cityRouter);
app.use('/tag', tagRouter);
app.use('/restaurant', restaurantRouter);

module.exports = app;
