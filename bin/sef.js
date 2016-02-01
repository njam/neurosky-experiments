#!/usr/bin/env node

var Promise = require('bluebird');
var MongodbConnection = require('../lib/mongodb/connection');
var FFTSampler = require('../lib/fft/sampler');
var FFTSpectrum = require('../lib/fft/spectrum');
var SEF = require('../lib/dream/sef');
var StreamPrinter = require('../lib/stream/printer');
var promisifyStream = require('../lib/stream/promisify');
var cli = require('../lib/cli');

var mongo = new MongodbConnection('mongodb://localhost:27017/neurosky');
var timeMin = new Date('2015-05-07 21:26:00 +0200');
var timeMax = new Date('2015-05-07 22:27:00 +0200');

cli.observePromise('sef', Promise.join(
  mongo.getReader('samples', {
    type: 'rawEeg',
    time: {$gte: timeMin, $lte: timeMax}
  }),

  function(reader) {
    var sampler = new FFTSampler(512, 1);
    var sef = new SEF();
    var printer = new StreamPrinter(1);
    cli.observeStreamResult('reader', reader);
    reader.pipe(sampler).pipe(sef).pipe(printer);
    return promisifyStream(reader);
  })
);
