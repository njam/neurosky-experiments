#!/usr/bin/env node

var Promise = require('bluebird');
var MongodbConnection = require('../lib/mongodb/connection');
var FFTSampler = require('../lib/fft/sampler');
var SEF = require('../lib/sleep/sef');
var StreamPrinter = require('../lib/stream/printer');
var promisifyStream = require('../lib/stream/promisify');
var cli = require('../lib/cli');
var plot = require('../lib/plot').plot;
var streamToArray = require('stream-to-array');

var mongo = new MongodbConnection('mongodb://localhost:27017/neurosky');
var timeMin = new Date('2015-02-01 12:00:00 +0100');
var timeMax = new Date('2015-02-02 12:00:00 +0100');

cli.observePromise('sef', Promise.join(
  mongo.getReader('night1', {
    type: 'rawEeg',
    time: {$gte: timeMin, $lte: timeMax}
  }),

  function(reader) {
    var sampler = new FFTSampler(512, 2);
    var sef = new SEF();
    var printer = new StreamPrinter(1);
    cli.observeStreamResult('reader', reader);
    reader.pipe(sampler).pipe(sef).pipe(printer);

    return streamToArray(sef).then(function(sampleList) {
      plot(sampleList);
    });
  })
);
