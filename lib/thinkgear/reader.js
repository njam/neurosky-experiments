var util = require('util');
var assert = require('assert');
var stream = require('stream');
var Promise = require('bluebird');
var net = require('net');
var merge = require('merge');
var sha1 = require('sha1');
var Sample = require('../sample');

/**
 * @param {ThinkgearClient} client
 * @param {Array<String>} [sampleTypes]
 * @constructor
 */
var ThinkgearReader = function(client, sampleTypes) {
  stream.Readable.call(this, {objectMode: true});

  var self = this;

  client.on('data', function(chunk) {
    if (sampleTypes) {
      Object.keys(chunk).forEach(function(key) {
        if (sampleTypes.indexOf(key) === -1) {
          delete(chunk[key]);
        }
      });
    }
    if (Object.keys(chunk).length > 0) {
      self.push(new Sample(new Date(), chunk));
    }
  });

  client.on('error', function(error) {
    self.emit('error', error);
  });

  client.on('close', function() {
    self.push(null);
  });

  this.client = client;
};
util.inherits(ThinkgearReader, stream.Readable);

/**
 * @protected
 */
ThinkgearReader.prototype._read = function() {
};

module.exports = ThinkgearReader;
