var util = require('util');
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
  var sample = new Sample(data.time, data.type, data.value);
  this.push(sample);
  callback();
};

module.exports = Reader;
