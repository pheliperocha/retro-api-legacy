var path = require('path');
var qs = require('querystring');
var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var request = require('request');

var config = require('./config');

var app = express();

app.set('port', 5000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./router'));

var server = app.listen(app.get('port'), app.get('host'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('subscribe', function(retroId) {
        socket.join(retroId);
    });

    socket.on('enter', data => {
        io.in(data.retroId).emit('enter_member', data.user);
    });

    socket.on('left', data => {
        io.in(data.retroId).emit('left_member', data.user);
    });

});