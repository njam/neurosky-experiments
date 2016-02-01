var util = require('util');
var assert = require('assert');
var stream = require('stream');
var dsp = require('digitalsignals');
var Spectrum = require('./spectrum');
var Sample = require('../sample');

/**
 * @param {Number} sampleRate Hertz
 * @param {Number} fftLength Seconds
 * @constructor
 */
var Sampler = function(sampleRate, fftLength) {
  stream.Transform.call(this, {objectMode: true});

  this.sampleRate = sampleRate;
  this.bufferSize = fftLength * this.sampleRate;
  this.sampleBuffer = [];
  this.fft = new dsp.FFT(this.bufferSize, this.sampleRate);
};

util.inherits(Sampler, stream.Transform);

/**
 * @returns {Number}
 */
Sampler.prototype.getSampleRate = function() {
  return this.sampleRate;
};

/**
 * @returns {Number}
 */
Sampler.prototype.getBufferSize = function() {
  return this.bufferSize;
};

/**
 * @param {Sample} sample
 * @param {String} encoding
 * @param {Function} callback
 * @private
 */
Sampler.prototype._transform = function(sample, encoding, callback) {
  assert(sample instanceof Sample);
  this.sampleBuffer.push(sample.getValue('rawEeg', Number));
  if (this.sampleBuffer.length === this.fft.bufferSize) {
    this.fft.forward(this.sampleBuffer);
    this.sampleBuffer = [];

    var magnitudeList = {};
    for (var binIndex = 0; binIndex < this.getBufferSize() / 2; binIndex++) {
      magnitudeList[binIndex] = this.fft.spectrum[binIndex];
    }
    var spectrum = new Spectrum(this, magnitudeList);
    this.push(spectrum);
  }
  callback();
};

module.exports = Sampler;
