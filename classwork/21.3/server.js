var express = require('express');
var logger = require('morgan');

var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static('public'));

app.listen(PORT, function() {
  console.log("Listening on", PORT);
});
