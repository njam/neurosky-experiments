var util = require('util');
var stream = require('stream');
var Sample = require('../sample');

/**
 * @param {Collection} collection
 * @constructor
 */
var Writer = function(collection) {
  stream.Writable.call(this, {objectMode: true});

  this.collection = collection;
};
util.inherits(Writer, stream.Writable);

/**
 * @param {Sample} chunk
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Writer.prototype._write = function(chunk, encoding, callback) {
  var doc = {time: chunk.time, type: chunk.type, value: chunk.value};
  this.collection.insertOne(doc).then(function() {
    callback();
  }).catch(function(e) {
    callback('Writing to mongodb failed: ' + e)
  });
};

module.exports = Writer;
