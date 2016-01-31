var Promise = require('bluebird');

/**
 * @param {Stream} stream
 * @return {Promise}
 */
function promisifyStream(stream) {
  return new Promise(function(resolve, reject) {
    stream.once('error', reject);
    if (stream.writable) {
      stream.once('finish', resolve);
    } else if (stream.readable) {
      stream.once('end', resolve);
    } else {
      resolve();
    }
  });
}

module.exports = promisifyStream;
