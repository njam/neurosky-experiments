var util = require('util');
var assert = require('assert');
var stream = require('stream');
var Sample = require('../sample');

/**
 * @param {Cursor} cursor
 * @constructor
 */
var Reader = function(cursor) {
  stream.Transform.call(this, {objectMode: true});

  cursor.stream().pipe(this);
};
util.inherits(Reader, stream.Transform);

/**
 * @param {Object} data
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Reader.prototype._transform = function(data, encoding, callback) {
  assert(data instanceof Object);
  var values = {};
  values[data.type] = data.value;
  var sample = new Sample(data.time, values);
  this.push(sample);
  callback();
};

module.exports = Reader;
