var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var Reader = require('./reader');
var Writer = require('./writer');

/**
 * @param {String} serverUrl
 * @constructor
 */
var Connection = function(serverUrl) {
  this.serverUrl = serverUrl;
};

/**
 * @param {String} collectionName
 * @param {Object} selector
 * @return {Promise}
 */
Connection.prototype.getReader = function(collectionName, selector) {
  var self = this;
  return this.connect().then(function(db) {
    var collection = db.collection(collectionName);
    var cursor = collection.find(selector).sort({time: -1});
    var reader = new Reader(cursor);
    reader.on('end', function() {
      db.close();
    });
    return reader;
  });
};

/**
 * @param {String} collectionName
 * @return {Promise}
 */
Connection.prototype.getWriter = function(collectionName) {
  var self = this;
  return this.connect().then(function(db) {
    var collection = db.collection(collectionName);
    return collection.createIndex({time: 1, type: 1}).then(function() {
      var writer = new Writer(collection);
      writer.on('finish', function() {
        db.close();
      });
      return writer;
    });
  });
};

/**
 * @return {Promise}
 */
Connection.prototype.connect = function() {
  if (this.db) {
    return Promise.resolve(this.db);
  }
  var self = this;
  return MongoClient.connect(this.serverUrl).then(function(db) {
    return db;
  });
};

module.exports = Connection;
