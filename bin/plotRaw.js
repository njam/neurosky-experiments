#!/usr/bin/env node

var Promise = require('bluebird');
var MongodbConnection = require('../lib/mongodb/connection');
var StreamPrinter = require('../lib/stream/printer');
var promisifyStream = require('../lib/stream/promisify');
var cli = require('../lib/cli');
var plot = require('../lib/plot').plot;
var streamToArray = require('stream-to-array');

var mongo = new MongodbConnection('mongodb://localhost:27017/neurosky');
var timeMin = new Date('2015-05-07 21:26:00 +0200');
var timeMax = new Date('2015-05-07 21:36:00 +0200');

cli.observePromise('plotRaw', Promise.join(
  mongo.getReader('samples', {
    type: 'rawEeg',
    time: {$gte: timeMin, $lte: timeMax}
  }),

  function(reader) {
    var printer = new StreamPrinter(1);
    reader.pipe(printer);
    return streamToArray(reader).then(function(sampleList) {
      plot(sampleList);
    });
  })
);
