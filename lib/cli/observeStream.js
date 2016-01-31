var Promise = require('bluebird');
var promisifyStream = require('../stream/promisify');

/**
 * @param {Promise} streamPromise
 * @return {Promise}
 */
function observeStream(streamPromise) {
  var dataCount = 0;
  var timeOutput = new Date();

  streamPromise.then(function(stream) {
    stream.on('data', function(sample) {
      dataCount++;
      var time = new Date();
      if ((time - timeOutput) / 1000 > 1) {
        process.stdout.write(time + ': ' + dataCount + ' samples (last: ' + sample.type + ")\n");
        timeOutput = time;
      }
    });
    return promisifyStream(stream);
  }).then(function() {
    console.log('Done.');
  }).catch(function(error) {
    console.error('Error: ' + error)
  });
}

module.exports = observeStream;
