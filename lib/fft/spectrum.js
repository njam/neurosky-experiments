/**
 * @param {FFTSampler} sampler
 * @param {Object} spectrum
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
 * @param {Number} frequencyMin
 * @param {Number} frequencyMax
 * @returns {FFTSpectrum}
 */
FFTSpectrum.prototype.bandpass = function(frequencyMin, frequencyMax) {
  var spectrum = [];
  var binMin = this.getBin(frequencyMin);
  var binMax = this.getBin(frequencyMax);
  for (var binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    if (binIndex < binMin || binIndex > binMax) {
      spectrum[binIndex] = 0;
    } else {
      spectrum[binIndex] = this.spectrum[binIndex];
    }
  }
  return new FFTSpectrum(this.sampler, spectrum);
};

/**
 * @param {Number} frequencyMin
 * @param {Number} frequencyMax
 * @returns {Number}
 */
FFTSpectrum.prototype.getMagnitudeByFrequencyRange = function(frequencyMin, frequencyMax) {
  var binMin = this.getBin(frequencyMin);
  var binMax = this.getBin(frequencyMax);
  var magnitude = 0;
  for (var bin = binMin; bin <= binMax; bin++) {
    magnitude += this.spectrum[bin];
  }
  return magnitude;
};

/**
 * @param {Number} rate
 * @returns {Number}
 */
FFTSpectrum.prototype.getSEF = function(rate) {
  var binIndex;

  var sumTotal = 0;
  for (binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    sumTotal += this.spectrum[binIndex];
  }

  var sumSEF = 0;
  for (binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    sumSEF += this.spectrum[binIndex];
    if (sumSEF > sumTotal * rate) {
      return this.getFrequency(binIndex);
    }
  }
  throw new Error('Cannot detect SEF for `' + rate + '`');
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
