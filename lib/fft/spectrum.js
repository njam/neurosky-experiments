/**
 * @param {Sampler} sampler
 * @param {Object} magnitudeList
 * @constructor
 */
var Spectrum = function(sampler, magnitudeList) {
  this.sampler = sampler;
  this.magnitudeList = magnitudeList;
};

/**
 * @param {Number} binIndex
 * @returns {Number} Hertz
 */
Spectrum.prototype.getFrequency = function(binIndex) {
  return binIndex * this.sampler.getSampleRate() / this.sampler.getBufferSize();
};

/**
 * @param {Number} frequency Hertz
 * @returns {Number}
 */
Spectrum.prototype.getBin = function(frequency) {
  var bin = frequency / (this.sampler.getSampleRate() / this.sampler.getBufferSize());
  bin = Math.round(bin);
  bin = Math.max(bin, 0);
  bin = Math.min(bin, this.getBinCount() - 1);
  return bin;
};

/**
 * @param {Number} frequencyMin
 * @param {Number} frequencyMax
 * @returns {Spectrum}
 */
Spectrum.prototype.bandpass = function(frequencyMin, frequencyMax) {
  var spectrum = [];
  var binMin = this.getBin(frequencyMin);
  var binMax = this.getBin(frequencyMax);
  for (var binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    if (binIndex < binMin || binIndex > binMax) {
      spectrum[binIndex] = 0;
    } else {
      spectrum[binIndex] = this.magnitudeList[binIndex];
    }
  }
  return new Spectrum(this.sampler, spectrum);
};

/**
 * @param {Number} frequencyMin
 * @param {Number} frequencyMax
 * @returns {Number}
 */
Spectrum.prototype.getMagnitudeByFrequencyRange = function(frequencyMin, frequencyMax) {
  var binMin = this.getBin(frequencyMin);
  var binMax = this.getBin(frequencyMax);
  var magnitude = 0;
  for (var bin = binMin; bin <= binMax; bin++) {
    magnitude += this.magnitudeList[bin];
  }
  return magnitude;
};

/**
 * @param {Number} rate
 * @returns {Number}
 */
Spectrum.prototype.getSEF = function(rate) {
  var binIndex;

  var powerTotal = 0;
  for (binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    powerTotal += Math.pow(this.magnitudeList[binIndex], 2);
  }

  var power = 0;
  for (binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    power += Math.pow(this.magnitudeList[binIndex], 2);
    if (power >= powerTotal * rate) {
      return this.getFrequency(binIndex);
    }
  }
  throw new Error('Cannot detect SEF for `' + rate + '`');
};

/**
 * @returns {Number}
 */
Spectrum.prototype.getBinCount = function() {
  return this.sampler.getBufferSize() / 2;
};

/**
 * @param {Number} [frequencyMin]
 * @param {Number} [frequencyMax]
 * @returns {Number}
 */
Spectrum.prototype.getPower = function(frequencyMin, frequencyMax) {
  var binMin = frequencyMin ? this.getBin(frequencyMin) : 0;
  var binMax = frequencyMax ? this.getBin(frequencyMax) : this.getBinCount() - 1;
  var power = 0;
  for (var binIndex = binMin; binIndex <= binMax; binIndex++) {
    power += this.magnitudeList[binIndex];
  }
  return power;
};

/**
 * @returns {String}
 */
Spectrum.prototype.toString = function() {
  var output = '';
  for (var binIndex = 0; binIndex < this.getBinCount(); binIndex++) {
    var frequency = this.getFrequency(binIndex);
    var magnitude = this.magnitudeList[binIndex];
    output += frequency.toFixed(2) + 'Hz: ' + magnitude.toFixed(2) + "\n";
  }
  return output;
};

module.exports = Spectrum;
