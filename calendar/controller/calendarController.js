var express = require("express");
var oauth = require('oauth');
var mongo = require('mongodb');
var gcal = require('google-calendar');
var q = require('q');
var oa;
var app = express();

var clientId = 'GOOGLE_CLIENT_ID';
var clientSecret = 'GOOGLE_CLIENT_SECRET';
var scopes = 'https://www.googleapis.com/auth/calendar';
var googleUserId;
var refreshToken;
var baseUrl;

function authorize(){
  var deferred = q.defer();

  oa = new oauth.OAuth2(clientId,
            clientSecret,
            "https://accounts.google.com/o",
            "/oauth2/auth",
            "/oauth2/token");

  if(refreshToken) {
    oa.getOAuthAccessToken(refreshToken, {grant_type:'refresh_token', client_id: clientId, client_secret: clientSecret}, function(err, access_token, refresh_token, res){

      //lookup settings from database
      connect().then(function(){
        database.collection(mongoCollectionName).findOne({google_user_id: googleUserId}, function(findError, settings){

          var expiresIn = parseInt(res.expires_in);
          var accessTokenExpiration = new Date().getTime() + (expiresIn * 1000);

          //add refresh token if it is returned
          if(refresh_token != undefined) settings.google_refresh_token = refresh_token;

          //update access token in database
          settings.google_access_token = access_token;
          settings.google_access_token_expiration = accessTokenExpiration;

          database.collection(mongoCollectionName).save(settings);

          deferred.resolve(access_token);
        });
      });

    })
  }
  else {
    deferred.reject({error: 'Application needs authorization.'});
  }

  return deferred.promise;
}

function getAccessToken(){
  var deferred = q.defer();
  var accessToken;

  connect().then(function(){

    database.collection(mongoCollectionName).findOne({google_user_id: googleUserId}, function(findError, settings){
      //check if access token is still valid
      var today = new Date();
      var currentTime = today.getTime();
      if(currentTime < settings.google_access_token_expiration)
      {
        //use the current access token
        accessToken = settings.google_access_token;
        deferred.resolve(accessToken)
      }
      else
      {
        //refresh the access token
        authorize().then(function(token){

          accessToken = token;
          deferred.resolve(accessToken);

        }, function(error){

          deferred.reject(error);

        });
      }
    });

  }, function(error){
    deferred.reject(error);
  });

  return deferred.promise;
}

app.get('/events', function(request, response){

  var getGoogleEvents = function(accessToken)
  {
    //instantiate google calendar instance
    var google_calendar = new gcal.GoogleCalendar(accessToken);

    google_calendar.events.list(googleUserId, {'timeMin': new Date().toISOString()}, function(err, eventList){
      if(err){
        response.send(500, err);
      }
      else{
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(eventList, null, '\t'));
        response.end();
      }
    });
  };

  //retrieve current access token
  getAccessToken().then(function(accessToken){
    getGoogleEvents(accessToken);
  }, function(error){
    //TODO: handle getAccessToken error
  });

});

app.post('/event', function(request, response){

  var addEventBody = {
    'status':'confirmed',
    'summary': request.body.contact.firstName + ' ' + request.body.contact.lastName,
    'description': request.body.contact.phone + '\n' + request.body.contact.details,
    'organizer': {
      'email': googleUserId,
      'self': true
    },
    'start': {
      'dateTime': request.body.startdate,
    },
    'end': {
      'dateTime': request.body.enddate
    },
    'attendees': [
        {
          'email': googleUserId,
          'organizer': true,
          'self': true,
          'responseStatus': 'needsAction'
        },
        {
          'email': request.body.contact.email,
        'organizer': false,
        'responseStatus': 'needsAction'
        }
    ]
  };

  var addGoogleEvent = function(accessToken){
    //instantiate google calendar instance
    var google_calendar = new gcal.GoogleCalendar(accessToken);
    google_calendar.events.insert(googleUserId, addEventBody, function(addEventError, addEventResponse){
      console.log('GOOGLE RESPONSE:', addEventError, addEventResponse);

      if(!addEventError)
        response.send(200, addEventResponse);

      response.send(400, addEventError);
    });
  };

  //retrieve current access token
  getAccessToken().then(function(accessToken){
    addGoogleEvent(accessToken);
  }, function(error){
    //TODO: handle error
  });

});
