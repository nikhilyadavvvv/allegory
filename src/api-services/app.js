var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var fileupload = require("express-fileupload");

var users = require('./routes/users');
var story = require('./routes/story');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileupload());
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/story', story);


global.appRoot = path.resolve(__dirname);

app.use('/static',express.static(path.join(global.appRoot, 'public/uploads/')));

module.exports = app;
