var util = require('util');
var assert = require('assert');
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
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Writer.prototype._write = function(sample, encoding, callback) {
  assert(sample instanceof Sample);
  var docs = sample.getKeys().map(function(key) {
    return {time: sample.time, type: key, value: sample.getValue(key, Number)};
  });
  this.collection.insertMany(docs).then(function() {
    callback();
  }).catch(function(e) {
    callback('Writing to mongodb failed: ' + e)
  });
};

module.exports = Writer;
