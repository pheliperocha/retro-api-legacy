var path = require('path');
var qs = require('querystring');
var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var request = require('request');
require('dotenv').load();

var config = require('./config');

var app = express();

app.set('port', process.env.PORT || 5000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);
app.use(require('./router')(io));