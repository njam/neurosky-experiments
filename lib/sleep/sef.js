var util = require('util');
var assert = require('assert');
var stream = require('stream');
var FFTSpectrum = require('../fft/spectrum');
var Sample = require('../sample');

/**
 * @constructor
 */
var SEF = function() {
  stream.Transform.call(this, {objectMode: true});
};
util.inherits(SEF, stream.Transform);

/**
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
SEF.prototype._transform = function(sample, encoding, callback) {
  assert(sample instanceof Sample);
  var spectrum = sample.getValue('spectrum', FFTSpectrum);
  var spectrum8to16 = spectrum.bandpass(8, 16);
  var sef50 = spectrum8to16.getSEF(0.5);
  var sef95 = spectrum8to16.getSEF(0.95);
  var absolutePower = 20 * Math.log(spectrum.getPower(8, 16));
  var relativePower = 20 * Math.log(spectrum.getPower(8, 16) / spectrum.getPower());
  this.push(new Sample(sample.time, {
    sef50: sef50,
    sef95: sef95,
    sefd: sef95 - sef50,
    absolutePower: absolutePower,
    relativePower: relativePower
  }));
  callback();
};

module.exports = SEF;
