var events = require('events');
var net = require('net');
var util = require('util');
var merge = require('merge');
var sha1 = require('sha1');

var ThinkgearClient = function(options) {
  if (!options.appName) {
    throw new Error('error: please provide an app name');
  }

  this.config = merge({
    port: 13854,
    host: '127.0.0.1',
    appKey: sha1(options.appName),
    enableRawOutput: false
  }, options);

  this.client = null;

  events.EventEmitter.call(this);
};

util.inherits(ThinkgearClient, events.EventEmitter);

ThinkgearClient.prototype.connect = function(callback) {
  var self = this;

  this.client = net.connect(this.config.port, this.config.host, function() {
    self._sendAuth();
    self._sendConfig();
    callback(self);
  });

  this.client.on('data', function(data) {
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

  this.client.on('error', function(err) {
    self._error(err);
  });

  this.client.on('close', function() {
    self._close();
  });
};

ThinkgearClient.prototype._send = function(message) {
  this.client.write(JSON.stringify(message));
};

ThinkgearClient.prototype._sendAuth = function() {
  this._send({appName: this.config.appName, appKey: this.config.appKey});
};

ThinkgearClient.prototype._sendConfig = function() {
  this._send({format: 'Json', enableRawOutput: this.config.enableRawOutput});
};

ThinkgearClient.prototype._error = function(error) {
  this.emit('error', error);
};

ThinkgearClient.prototype._close = function() {
  this.client.destroy();
};

exports.createClient = function(options, callback) {
  var client = new ThinkgearClient(options);
  client.connect(callback);
};
