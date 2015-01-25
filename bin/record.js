#!/usr/bin/env node

var sha1 = require('sha1');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ThinkgearClient = require('../lib/thinkgear/client');


MongoClient.connect('mongodb://localhost:27017/neurosky', function (err, db) {
  assert.equal(null, err);
  var collection = db.collection('samples');

  var storeSample = function (type, value) {
    var doc = {time: new Date(), type: type, value: value};
    collection.insert(doc, function (error, result) {
      if (error) {
        console.log('Error storing sample: ' + error);
      }
    });
  };

  var storeSamplesForKeys = function (object) {
    Object.keys(object).forEach(function (key) {
      storeSample(key, object[key]);
    });
  };

  var thinkgear = ThinkgearClient.create({
    appName: 'foo',
    appKey: sha1('foo'),
    enableRawOutput: false
  });

  thinkgear.on('data', function (data) {
    var time = new Date();
    process.stdout.write("Data: " + time + "\r");
    if (data.blinkStrength) {
      storeSample('blinkStrength', data.blinkStrength);
    }
    if (data.poorSignalLevel) {
      storeSample('poorSignalLevel', data.poorSignalLevel);
    }
    if (data.eSense) {
      storeSamplesForKeys(data.eSense);
    }
    if (data.eegPower) {
      storeSamplesForKeys(data.eegPower);
    }
  });

  thinkgear.on('error', function (error) {
    console.log('Error: ' + error);
  });

  thinkgear.on('close', function () {
    console.log('Connection closed.');
  });

  thinkgear.connect();

});
