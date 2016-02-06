var events = require('events');
var net = require('net');
var util = require('util');
var merge = require('merge');
var sha1 = require('sha1');
var Promise = require('bluebird');
var Reader = require('./reader');

/**
 * @param {Object} options
 * @constructor
 */
var ThinkgearClient = function(options) {
  if (!options.appName) {
    throw new Error('error: please provide an app name');
  }

  this.config = merge({
    port: 13854,
    host: '127.0.0.1',
    appKey: sha1(options.appName),
    enableRawOutput: true
  }, options);

  this.client = null;

  events.EventEmitter.call(this);
};
util.inherits(ThinkgearClient, events.EventEmitter);

/**
 * @returns {Promise}
 */
ThinkgearClient.prototype.connect = function() {
  var self = this;

  return new Promise(function(resolve, reject) {

    self.client = net.connect(self.config.port, self.config.host, function() {
      self._sendAuth();
      self._sendConfig();
      resolve(self);
    });

    self.client.on('data', function(data) {
      var jsonList = data.toString('utf-8').split("\r");
      jsonList = jsonList.filter(function(json) {
        return json.length > 0;
      });
      jsonList.forEach(function(json) {
        try {
          self.emit('data', JSON.parse(json));
        } catch (e) {
          self._sendConfig();
          self._error(['Cannot parse data.', ' Data: `' + data.toString('utf-8') + '`', ' Error: ' + e].join("\n"));
        }
      });
    });

    self.client.on('error', function(error) {
      self._error(error);
      reject(error);
    });

    self.client.on('close', function() {
      self.emit('close');
      self.disconnect();
    });
  });
};

ThinkgearClient.prototype.disconnect = function() {
  this.client.destroy();
};

/**
 * @param {Object} message
 * @private
 */
ThinkgearClient.prototype._send = function(message) {
  this.client.write(JSON.stringify(message));
};

/**
 * @private
 */
ThinkgearClient.prototype._sendAuth = function() {
  this._send({appName: this.config.appName, appKey: this.config.appKey});
};

/**
 * @private
 */
ThinkgearClient.prototype._sendConfig = function() {
  this._send({format: 'Json', enableRawOutput: this.config.enableRawOutput});
};

/**
 * @param {String} error
 * @private
 */
ThinkgearClient.prototype._error = function(error) {
  this.emit('error', error);
};

/**
 * @param {Object} options
 * @param {Array<String>} [sampleTypes]
 * @returns {Promise}
 */
ThinkgearClient.getReader = function(options, sampleTypes) {
  var client = new ThinkgearClient(options);
  return client.connect().then(function() {
    return new Reader(client, sampleTypes);
  });
};

module.exports = ThinkgearClient;
