var util = require('util');
var assert = require('assert');
var stream = require('stream');
var Sample = require('../sample');

/**
 * @param {Number} duration
 * @constructor
 */
var Average = function(duration) {
  stream.Transform.call(this, {objectMode: true});

  this.duration = duration * 1000;
  this.values = {};
  this.timeLast = 0;
};
util.inherits(Average, stream.Transform);

/**
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Average.prototype._transform = function(sample, encoding, callback) {
  assert(sample instanceof Sample);

  var time = sample.getTime();
  this._addSample(sample);
  if (time > this.timeLast) {
    this._removeExpired(time);
    this.push(this._getAverage(time));
    this.timeLast = time;
  }
  callback();
};

/**
 * @param {Date} time
 * @private
 */
Average.prototype._removeExpired = function(time) {
  var values = this.values;
  var duration = this.duration;
  Object.keys(values).forEach(function(key) {
    values[key] = values[key].filter(function(item) {
      return item.time >= (time - duration);
    });
    if (values[key].length === 0) {
      delete values[key];
    }
  });
};

/**
 * @param {Sample} sample
 * @private
 */
Average.prototype._addSample = function(sample) {
  var values = this.values;
  sample.getKeys().forEach(function(key) {
    values[key] = values[key] || [];
    values[key].push({time: sample.getTime(), value: sample.getValue(key, 'Number')});
  });
};

/**
 * @param {Date} time
 * @return {Sample}
 * @private
 */
Average.prototype._getAverage = function(time) {
  var values = this.values;
  var averages = {};
  Object.keys(values).forEach(function(key) {
    var sum = 0;
    values[key].forEach(function(item) {
      sum += item.value;
    });
    averages[key] = sum / values[key].length;
  });
  return new Sample(time, averages);
};

module.exports = Average;
