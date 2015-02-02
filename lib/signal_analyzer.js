var events = require('events');
var util = require('util');
var dsp = require('digitalsignals');

/**
 * @param {Number} sampleRate Hertz
 * @param {Number} fftLength Seconds
 * @constructor
 */
var SignalAnalyzer = function(sampleRate, fftLength) {
  var bufferSize = fftLength * sampleRate;
  this.sampleBuffer = [];
  this.fft = new dsp.FFT(bufferSize, sampleRate);
};

util.inherits(SignalAnalyzer, events.EventEmitter);

/**
 * @param {Array} sample
 */
SignalAnalyzer.prototype.addSample = function(sample) {
  this.sampleBuffer.push(sample);
  if (this.sampleBuffer.length === this.fft.bufferSize) {
    this.fft.forward(this.sampleBuffer);
    this.sampleBuffer = [];
    this.emit('spectrum', this.fft.spectrum);
  }
};

/**
 * @param {Number} binIndex
 * @returns {Number} Hertz
 */
SignalAnalyzer.prototype.getFrequency = function(binIndex) {
  return binIndex * this.fft.sampleRate / this.fft.bufferSize;
};

/**
 * @param {Number} frequency Hertz
 * @returns {Number}
 */
SignalAnalyzer.prototype.getBin = function(frequency) {
  var bin = frequency / (this.fft.sampleRate / this.fft.bufferSize);
  bin = Math.round(bin);
  bin = Math.max(bin, 0);
  bin = Math.min(bin, this.getBinCount() - 1);
  return bin;
};

/**
 * @returns {Number}
 */
SignalAnalyzer.prototype.getBinCount = function() {
  return this.fft.bufferSize / 2;
};

/**
 * @param {Object} spectrum
 */
SignalAnalyzer.prototype.printSpectrum = function(spectrum) {
  for (var binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    var frequency = this.getFrequency(binIndex);
    var magnitude = spectrum[binIndex];
    console.log(frequency.toFixed(2) + 'Hz: ' + magnitude.toFixed(2));
  }
};

exports.SignalAnalyzer = SignalAnalyzer;
