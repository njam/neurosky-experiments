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

  ThinkgearClient.createClient({appName: 'record'}, function(thinkgear) {
    thinkgear.on('data', function(data) {
      var time = new Date();
      if (data.blinkStrength) {
        storeSample(time, 'blinkStrength', data.blinkStrength);
      }
      if (data.poorSignalLevel) {
        storeSample(time, 'poorSignalLevel', data.poorSignalLevel);
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
