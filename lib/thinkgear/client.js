var events = require('events');
var net = require('net');
var util = require('util');

var Thinkgear = function (opts) {
  if (!opts || !opts.appName) {
    throw new Error('error: please provide an app name');
  }

  if (!opts || !opts.appKey) {
    throw new Error('error: please provide an app key');
  }

  this.client = null;

  this.port = opts.port || 13854;
  this.host = opts.host || '127.0.0.1';

  this.auth = {};
  this.auth.appName = opts.appName;
  this.auth.appKey = opts.appKey;

  this.config = {};
  this.config.enableRawOutput = (typeof opts.enableRawOutput === 'boolean') ? opts.enableRawOutput : false;
  this.config.format = 'Json';

  this.setMaxListeners(0);
  events.EventEmitter.call(this);
};

util.inherits(Thinkgear, events.EventEmitter);

exports.create = function (opts) {
  return new Thinkgear(opts);
};

Thinkgear.prototype.connect = function () {
  var self = this;

  this.client = net.connect(this.port, this.host, function () {
    self._send(self.auth);
    self._sendConfig();
  });

  this.client.on('data', function (data) {
    var jsonList = data.toString('utf-8').split("\r");
    jsonList = jsonList.filter(function (json) {
      return json.length > 0;
    });
    jsonList.forEach(function (json) {
      self._data(json);
    });
  });

  this.client.on('error', function (err) {
    self._error(err);
  });

  this.client.on('close', function () {
    self._close();
  });
};

Thinkgear.prototype._sendConfig = function () {
  this._send(this.config);
};

Thinkgear.prototype._send = function (message) {
  this.client.write(JSON.stringify(message));
};

Thinkgear.prototype._data = function (data) {
  try {
    this.emit('data', JSON.parse(data));
  } catch (e) {
    this._sendConfig();
    this._error(['Cannot parse data.', ' Data: `' + data.toString('utf-8') + '`', ' Error: ' + e].join("\n"));
  }
};

Thinkgear.prototype._error = function (error) {
  this.emit('error', error);
};

Thinkgear.prototype._close = function () {
  this.client.destroy();
};
