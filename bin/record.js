#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ThinkgearClient = require('../lib/thinkgear/client');


MongoClient.connect('mongodb://localhost:27017/neurosky', function(err, db) {
  assert.equal(null, err);
  var collection = db.collection('samples');

  var storeSample = function(time, type, value) {
    var doc = {time: time, type: type, value: value};
    collection.insert(doc, function(error, result) {
      if (error) {
        console.log('Error storing sample: ' + error);
      }
    });
  };

  var storeSamplesForKeys = function(time, object) {
    Object.keys(object).forEach(function(key) {
      storeSample(time, key, object[key]);
    });
  };

  ThinkgearClient.createClient({appName: 'record', enableRawOutput: true}, function(thinkgear) {
    var sampleCount = 0;
    var timeOutput = new Date();

    thinkgear.on('data', function(data) {
      sampleCount++;
      var time = new Date();
      if ((time - timeOutput) / 1000 > 1) {
        process.stdout.write(time + ': ' + sampleCount + " samples\r");
        timeOutput = time;
      }

      if (data.blinkStrength) {
        storeSample(time, 'blinkStrength', data.blinkStrength);
      }
      if (data.poorSignalLevel) {
        storeSample(time, 'poorSignalLevel', data.poorSignalLevel);
      }
      if (data.rawEeg) {
        storeSample(time, 'rawEeg', data.rawEeg);
      }
      if (data.eSense) {
        storeSamplesForKeys(time, data.eSense);
      }
      if (data.eegPower) {
        storeSamplesForKeys(time, data.eegPower);
      }
    });

    thinkgear.on('error', function(error) {
      console.log('Error: ' + error);
    });

    thinkgear.on('close', function() {
      console.log('Connection closed.');
    });
  });

});
