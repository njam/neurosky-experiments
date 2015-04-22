#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var FFTSampler = require('../lib/fft/sampler').FFTSampler;

var timeMin = new Date('2015-02-01 00:00:00');
var timeMax = new Date('2015-04-25 02:00:00');


MongoClient.connect('mongodb://localhost:27017/neurosky', function(err, db) {
  assert.equal(null, err);

  var fft = new FFTSampler(512, 1);
  var time = null;

  var collectionOutput = db.collection('samplesFFT');

  var storeSample = function(type, value) {
    var doc = {time: time, type: type, value: value};
    collectionOutput.insert(doc, function(error, result) {
      if (error) {
        console.log('Error storing sample: ' + error);
      }
    });
  };

  var storeMagnitude = function(spectrum, label, freqMin, freqMax) {
    var magnitude = spectrum.getMagnitudeByFrequencyRange(freqMin, freqMax);
    storeSample(label, magnitude);
  };

  fft.on('spectrum', function(spectrum) {
    process.stdout.write(time + "\r");

    storeMagnitude(spectrum, 'delta', 0.5, 2.75);
    storeMagnitude(spectrum, 'theta', 3.5, 6.75);
    storeMagnitude(spectrum, 'lowAlpha', 7.5, 9.25);
    storeMagnitude(spectrum, 'highAlpha', 10, 11.75);
    storeMagnitude(spectrum, 'lowBeta', 13, 16.75);
    storeMagnitude(spectrum, 'highBeta', 18, 29.75);
    storeMagnitude(spectrum, 'lowGamma', 31, 39.75);
    storeMagnitude(spectrum, 'highGamma', 41, 49.75);

    var spectrum8to16 = spectrum.bandpass(8, 16);
    storeSample('sef50', spectrum8to16.getSEF(0.5));
    storeSample('sef95', spectrum8to16.getSEF(0.95));
    storeSample('sefd', spectrum8to16.getSEF(0.95) - spectrum8to16.getSEF(0.5));
  });

  var collectionInput = db.collection('night1');

  console.log('Ensuring indices…');
  collectionInput.ensureIndex({time: 1, type: 1}, function(err) {
    assert.equal(null, err);

    console.log('Querying for samples…');
    collectionInput.find({
      type: 'rawEeg',
      time: {$gte: timeMin, $lte: timeMax}
    }).sort({time: 1}).each(function(err, data) {
      assert.equal(err, null);

      if (null !== data) {
        time = data.time;
        fft.addSample(data.value);
      } else {
        console.log("\nDone.\n");
        db.close();
      }
    });

  });
});
