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
 *
 * @param {Readable} stream
 * @protected
 */
function observeReaderProgress(stream) {
  var dataCount = 0;
  var timeOutput = new Date();
  stream.on('data', function(sample) {
    dataCount++;
    var time = new Date();
    if ((time - timeOutput) / 1000 > 1) {
      process.stdout.write(time + ': ' + dataCount + ' samples (last: ' + sample.getKeys().join(',') + ")\n");
      timeOutput = time;
    }
  });
}

/**
 * @param {String} name
 * @param {Readable, Writable} stream
 * @protected
 */
function observeStreamResult(name, stream) {
  var promise = promisifyStream(stream);
  this.observePromise(name, promise);
}

module.exports = {
  observePromise: observePromise,
  observeReaderProgress: observeReaderProgress,
  observeStreamResult: observeStreamResult
};
