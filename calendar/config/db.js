var mongoCollectionName = 'MONGO_COLLECTION_NAME';
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/default';
var database;

function connect(callback) {
  var deferred = q.defer();

  if(database === undefined)
  {
    mongo.Db.connect(mongoUri, function(err, db){
      if(err) deferred.reject({error: err});

      database = db;
      deferred.resolve();
    });
  }
  else
  {
    deferred.resolve();
  }

  return deferred.promise;
}
