var util = require('util');
var Abstract = require('./abstract');

/**
 * @param reader
 * @param writer
 * @constructor
 */
var Test = function(reader, writer) {
  this.reader = reader;
  this.writer = writer;
};
util.inherits(Test, Abstract);

Test.prototype.run = function() {
  this._observeReaderProgress(this.reader);
  this._observeStreamResult('reader', this.reader);
  this._observeStreamResult('writer', this.writer);
  this.reader.pipe(this.writer);
};

module.exports = Test;
