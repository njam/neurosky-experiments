var promisifyStream = require('./stream/promisify');

/**
 * @param {String} name
 * @param {Promise} promise
 * @protected
 */
function observePromise(name, promise) {
  console.log('Starting ' + name + '…');
  promise.then(function() {
    console.log(name + ' - done.');
  }).catch(function(error) {
    console.error(name + ' - error: ' + error)
  });
}

/**
 * @param {String} name
 * @param {Stream.Readable, Stream.Writable} stream
 * @protected
 */
function observeStreamResult(name, stream) {
  var promise = promisifyStream(stream);
  this.observePromise(name, promise);
}

module.exports = {
  observePromise: observePromise,
  observeStreamResult: observeStreamResult
};
