const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const Server = require('./GhoulsServer.js');

const indexRouter = require('./routes/index');
const dataRouter = require('./routes/data');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);

MongoClient.connect('mongodb://localhost:27017/ghoulshub').then((conn) => {
    app.set('server', new Server(7147, conn));
});

module.exports = app;
