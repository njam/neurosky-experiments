#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var json2csv = require('json2csv');
var fs = require('fs');
var connect = require('connect');
var serveStatic = require('serve-static');

var htmlPath = __dirname + '/../html/plot/';

var typeList = [
  'delta',
  'theta',
  'lowAlpha',
  'highAlpha',
  'lowBeta',
  'highBeta',
  'lowGamma',
  'highGamma',
  'attention',
  'meditation',
  'blinkStrength',
  'poorSignalLevel'
];


MongoClient.connect('mongodb://localhost:27017/neurosky', function(err, db) {
  assert.equal(null, err);

  console.log('Querying for samples…');

  db.collection('samples').aggregate([
    {$match: {type: {$in: typeList}}},
    {$group: {_id: '$time', valueList: {$push: {type: '$type', value: '$value'}}}}
  ], function(err, dataList) {
    assert.equal(err, null);

    console.log('Processing ' + dataList.length + ' samples…');

    var sampleList = dataList.map(function(data) {
      var sample = {time: data._id.toISOString().replace(/T/, ' ')};
      typeList.forEach(function(type) {
        sample[type] = undefined;
      });
      data.valueList.forEach(function(value) {
        sample[value['type']] = value['value'];
      });
      return sample;
    });

    json2csv({data: sampleList, fields: ['time'].concat(typeList)}, function(err, csv) {
      assert.equal(err, null);

      fs.writeFile(htmlPath + 'data.csv', csv, function(err) {
        assert.equal(err, null);

        console.log('Starting web server at: http://localhost:8080/');
        connect().use(serveStatic(htmlPath)).listen(8080);
      });
    });
  });
});
