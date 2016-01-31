var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var Reader = require('./reader');

/**
 * @param {String} serverUrl
 * @param {String} collectionName
 * @constructor
 */
var Collection = function(serverUrl, collectionName) {
  this.serverUrl = serverUrl;
  this.collectionName = collectionName;
};

/**
 * @param {Object} selector
 * @return {Promise}
 */
Collection.prototype.getReader = function(selector) {
  var self = this;
  return this.connect().then(function(db) {
    var collection = db.collection(self.collectionName);
    var cursor = collection.find(selector).sort({time: -1});
    var reader = new Reader(cursor);
    reader.on('end', function() {
      db.close();
    });
    return reader;
  });
};

Collection.prototype.ensureIndices = function() {
  //collection.createIndex({time: 1, type: 1});
};

/**
 * @return {Promise}
 */
Collection.prototype.connect = function() {
  if (this.db) {
    return Promise.resolve(this.db);
  }
  console.log('Connecting to MongoDB…');
  var self = this;
  return MongoClient.connect(this.serverUrl).then(function(db) {
    return db;
  });
};

module.exports = Collection;
