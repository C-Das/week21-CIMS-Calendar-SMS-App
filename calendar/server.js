var express = require("express");
var oauth = require('oauth');
var mongo = require('mongodb');
var gcal = require('google-calendar');
var logger = require("morgan");
var q = require('q');
var PORT = 3000;
var oa;
var app = express();

var db = require('./config/db.js');
var calendar = require('./controller/calendarController');

app.use(express.static(__dirname + "/public"));
app.use('/public', express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/views"));
app.use(express.static(__dirname + "/public/views/partials"));
app.use(logger('dev'));
app.use('/calendar', calendar);

// app.configure('development',function(){
//   console.log('!! DEVELOPMENT MODE !!');

//   googleUserId = 'GOOGLE_EMAIL_ADDRESS';
//   refreshToken = 'GOOGLE_REFRESH_TOKEN';
//   baseUrl = 'DEV_API_URL';
// });

// app.configure('production', function(){
//   console.log('!! PRODUCTION MODE !!');

//   googleUserId = 'GOOGLE_EMAIL_ADDRESS';
//   refreshToken = 'GOOGLE_REFRESH_TOKEN';
//   baseUrl = 'PRODUCTION_API_URL';
// });

app.listen(PORT, function() {
  console.log("Application is listening on PORT:" + PORT);
});
