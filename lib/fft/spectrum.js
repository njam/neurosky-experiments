/**
 * @param {FFTSampler} sampler
 * @param {Array} spectrum
 * @constructor
 */
var FFTSpectrum = function(sampler, spectrum) {
  this.sampler = sampler;
  this.spectrum = spectrum;
};

/**
 * @param {Number} binIndex
 * @returns {Number} Hertz
 */
FFTSpectrum.prototype.getFrequency = function(binIndex) {
  return binIndex * this.sampler.getSampleRate() / this.sampler.getBufferSize();
};

/**
 * @param {Number} frequency Hertz
 * @returns {Number}
 */
FFTSpectrum.prototype.getBin = function(frequency) {
  var bin = frequency / (this.sampler.getSampleRate() / this.sampler.getBufferSize());
  bin = Math.round(bin);
  bin = Math.max(bin, 0);
  bin = Math.min(bin, this.getBinCount() - 1);
  return bin;
};

/**
 * @returns {Number}
 */
FFTSpectrum.prototype.getBinCount = function() {
  return this.sampler.getBufferSize() / 2;
};

/**
 * @returns {String}
 */
FFTSpectrum.prototype.toString = function() {
  var output = '';
  for (var binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    var frequency = this.getFrequency(binIndex);
    var magnitude = this.spectrum[binIndex];
    output += frequency.toFixed(2) + 'Hz: ' + magnitude.toFixed(2) + "\n";
  }
  return output;
};

exports.FFTSpectrum = FFTSpectrum;
