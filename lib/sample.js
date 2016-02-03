var assert = require('assert');
var Type = require('type-of-is');

/**
 * @param {Date} time
 * @param {Object} values
 * @constructor
 */
var Sample = function(time, values) {
  this.time = time;
  this.values = values;
};

/**
 * @returns {Date}
 */
Sample.prototype.getTime = function() {
  return this.time;
};

/**
 * @returns {Array<String>}
 */
Sample.prototype.getKeys = function() {
  return Object.keys(this.values);
};

/**
 * @param {String} key
 * @param {String, Object} [assertType]
 * @return {Number}
 */
Sample.prototype.getValue = function(key, assertType) {
  if (!this.values.hasOwnProperty(key)) {
    throw new Error('Sample has no `' + key + '`-value (has: `' + this.getKeys().join(',') + '`).');
  }
  var value = this.values[key];
  if (assertType) {
    assert(Type.is(value, assertType), 'Expected value of type `' + Type.string(assertType) + '` but got `' + Type.string(value) + '`.');
  }
  return value;
};

module.exports = Sample;
