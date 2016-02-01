var util = require('util');
var assert = require('assert');
var stream = require('stream');
var FFTSpectrum = require('../fft/spectrum');
var Sample = require('../sample');

/**
 * @constructor
 */
var Bands = function() {
  stream.Transform.call(this, {objectMode: true});
};
util.inherits(Bands, stream.Transform);

/**
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Bands.prototype._transform = function(sample, encoding, callback) {
  assert(sample instanceof Sample);
  var spectrum = sample.getValue('spectrum', FFTSpectrum);
  var rangeList = {
    'delta': [0.5, 2.75],
    'theta': [3.5, 6.75],
    'lowAlpha': [7.5, 9.25],
    'highAlpha': [10, 11.75],
    'lowBeta': [13, 16.75],
    'highBeta': [18, 29.75],
    'lowGamma': [31, 39.75],
    'highGamma': [41, 49.75]
  };

  var values = {};
  Object.keys(rangeList).forEach(function(rangeName) {
    var range = rangeList[rangeName];
    values[rangeName] = spectrum.getMagnitudeByFrequencyRange(range[0], range[1]);
  });

  var sum = 0;
  Object.keys(values).forEach(function(key) {
    sum += values[key];
  });
  Object.keys(values).forEach(function(key) {
    values[key] = values[key] / sum;
  });

  this.push(new Sample(sample.time, values));
  callback();
};

module.exports = Bands;
