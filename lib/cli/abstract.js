var promisifyStream = require('../stream/promisify');

/**
 * @constructor
 */
var Abstract = function() {
};

Abstract.prototype.run = function() {
  throw new Error('Not implemented');
};

/**
 * @param {String} name
 * @param {Promise} promise
 * @protected
 */
Abstract.prototype._observePromise = function(name, promise) {
  promise.then(function() {
    console.log(name + ' - done.');
  }).catch(function(error) {
    console.error(name + ' - error: ' + error)
  });
};

/**
 *
 * @param {Readable} stream
 * @protected
 */
Abstract.prototype._observeReaderProgress = function(stream) {
  var dataCount = 0;
  var timeOutput = new Date();
  stream.on('data', function(sample) {
    dataCount++;
    var time = new Date();
    if ((time - timeOutput) / 1000 > 1) {
      process.stdout.write(time + ': ' + dataCount + ' samples (last: ' + sample.type + ")\n");
      timeOutput = time;
    }
  });
};

/**
 * @param {String} name
 * @param {Readable, Writable} stream
 * @protected
 */
Abstract.prototype._observeStreamResult = function(name, stream) {
  var promise = promisifyStream(stream);
  this._observePromise(name, promise);
};

module.exports = Abstract;
