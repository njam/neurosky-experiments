var util = require('util');
var assert = require('assert');
var stream = require('stream');
var Sample = require('../sample');
var dateFormat = require('dateformat');

/**
 * @param {Number} [waitInterval]
 * @constructor
 */
var Printer = function(waitInterval) {
  stream.Writable.call(this, {objectMode: true});

  this.output = process.stdout;
  this.waitInterval = waitInterval;
  this.lastOutputAt = 0;
};
util.inherits(Printer, stream.Writable);

/**
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Printer.prototype._write = function(sample, encoding, callback) {
  assert(sample instanceof Sample);
  if (this._shouldPrint()) {
    this._printSample(sample);
  }
  callback();
};

/**
 * @return {Boolean}
 * @private
 */
Printer.prototype._shouldPrint = function() {
  if (!this.waitInterval) {
    return true;
  }
  var time = new Date();
  var waitIntervalHasPassed = ((time - this.lastOutputAt) / 1000 > this.waitInterval);
  if (waitIntervalHasPassed) {
    this.lastOutputAt = time;
  }
  return waitIntervalHasPassed;
};

/**
 * @param {Sample} sample
 * @private
 */
Printer.prototype._printSample = function(sample) {
  var items = sample.getKeys().map(function(key) {
    return key + '=' + sample.getValue(key).toString();
  });
  var message = dateFormat(sample.time, 'yyyy-mm-dd HH:MM:ss') + ': ' + items.join("\t");
  this.output.write(message + "\n");
};

module.exports = Printer;
