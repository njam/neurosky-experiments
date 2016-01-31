/**
 * @param {Date} time
 * @param {String} type
 * @param {Number} [value]
 * @constructor
 */
var Sample = function(time, type, value) {
  this.time = time;
  this.type = type;
  this.value = value;
};

module.exports = Sample;
