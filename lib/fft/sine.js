var util = require('util');
var stream = require('stream');
var Sample = require('../sample');

/**
 * @param {Number} sampleRate Hertz
 * @param {Number} frequency Hertz
 * @constructor
 */
var Sine = function(sampleRate, frequency) {
  stream.Readable.call(this, {objectMode: true});

  this.sampleRate = sampleRate;
  this.frequency = frequency;
  this.sampleIndex = 0;
};
util.inherits(Sine, stream.Readable);

/**
 * @param {Number} size
 * @private
 */
Sine.prototype._read = function(size) {
  this._pushSample();
};

Sine.prototype._pushSample = function() {
  var time = (this.sampleIndex / this.sampleRate);
  var value = Math.sin(time * this.frequency * (Math.PI * 2));
  var sample = new Sample(new Date(), {rawEeg: value});
  this.sampleIndex++;
  this.push(sample);
};

module.exports = Sine;
