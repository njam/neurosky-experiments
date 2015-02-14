#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var plot = require('../lib/plot').plot;

var timeMin = new Date('2015-02-01 00:00:00');
var timeMax = new Date('2015-02-02 02:00:00');

var typeList = [
  'delta',
  'theta',
  'lowAlpha',
  'highAlpha',
  'lowBeta',
  'highBeta',
  'lowGamma',
  'highGamma'
];


MongoClient.connect('mongodb://localhost:27017/neurosky', function(err, db) {
  assert.equal(null, err);

  console.log('Querying for samples…');

  db.collection('samples').aggregate([
    {$match: {type: {$in: typeList}, time: {$gte: timeMin, $lte: timeMax}}},
    {$sort: {time: -1}},
    {
      $group: {
        _id: '$time',
        time: {$first: '$time'},
        valueList: {$push: {type: '$type', value: '$value'}}
      }
    }
  ], function(err, dataList) {
    assert.equal(err, null);

    console.log('Processing ' + dataList.length + ' samples…');

    var sampleList = dataList.map(function(data) {
      var sample = {time: data.time};
      typeList.forEach(function(type) {
        sample[type] = undefined;
      });
      data.valueList.forEach(function(value) {
        sample[value['type']] = value['value'];
      });

      var sampleNormalized = {
        delta: sample['delta'],
        theta: sample['theta'],
        lowAlpha: sample['lowAlpha'],
        highAlpha: sample['highAlpha'],
        lowBeta: sample['lowBeta'],
        highBeta: sample['highBeta'],
        lowGamma: sample['lowGamma'],
        highGamma: sample['highGamma']
      };

      var sum = 0;
      Object.keys(sampleNormalized).forEach(function(key) {
        sum += sampleNormalized[key];
      });
      Object.keys(sampleNormalized).forEach(function(key) {
        sampleNormalized[key] = sampleNormalized[key] / sum;
      });

      sampleNormalized['time'] = sample.time;
      if (-1 !== typeList.indexOf('blinkStrength')) {
        sampleNormalized['blinkStrength'] = sample['blinkStrength'] ? sample['blinkStrength'] / 255 : 0;
      }
      if (-1 !== typeList.indexOf('poorSignalLevel')) {
        sampleNormalized['poorSignalLevel'] = sample['poorSignalLevel'] ? sample['poorSignalLevel'] / 255 : 0;
      }
      return sampleNormalized;
    });

    plot(sampleList);
  });
});
