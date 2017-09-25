var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello Retrospective!');
});

app.listen(3000, function () {
  console.log('APP running on localhost:3000');
});