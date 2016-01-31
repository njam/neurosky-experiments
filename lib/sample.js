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
 * @returns {Array<String>}
 */
Sample.prototype.getKeys = function() {
  return Object.keys(this.values);
};

/**
 * @param {String} key
 * @return {Number}
 */
Sample.prototype.getValue = function(key) {
  if (!this.values.hasOwnProperty(key)) {
    throw new Error('Sample has no values `' + key + '`.');
  }
  return this.values[key];
};

module.exports = Sample;
