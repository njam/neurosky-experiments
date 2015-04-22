var events = require('events');
var util = require('util');
var dsp = require('digitalsignals');
var FFTSpectrum = require('./spectrum.js').FFTSpectrum;

/**
 * @param {Number} sampleRate Hertz
 * @param {Number} fftLength Seconds
 * @constructor
 */
var FFTSampler = function(sampleRate, fftLength) {
  this.sampleRate = sampleRate;
  this.bufferSize = fftLength * this.sampleRate;
  this.sampleBuffer = [];
  this.fft = new dsp.FFT(this.bufferSize, this.sampleRate);
};

util.inherits(FFTSampler, events.EventEmitter);

/**
 * @param {Array} sample
 */
FFTSampler.prototype.addSample = function(sample) {
  this.sampleBuffer.push(sample);
  if (this.sampleBuffer.length === this.fft.bufferSize) {
    this.fft.forward(this.sampleBuffer);
    this.sampleBuffer = [];
    var spectrum = new FFTSpectrum(this, this.fft.spectrum);
    this.emit('spectrum', spectrum);
  }
};

/**
 * @returns {Number}
 */
FFTSampler.prototype.getSampleRate = function() {
  return this.sampleRate;
};

/**
 * @returns {Number}
 */
FFTSampler.prototype.getBufferSize = function() {
  return this.bufferSize;
};

exports.FFTSampler = FFTSampler;