var json2csv = require('json2csv');
var assert = require('assert');
var fs = require('fs');
var connect = require('connect');
var serveStatic = require('serve-static');

var htmlPath = __dirname + '/../html/plot/';

var plot = function(sampleList) {
  sampleList.forEach(function(sample) {
    sample['time'] = sample['time'].toISOString().replace(/T/, ' ');
  });

  var keyList = ['time'];
  sampleList.forEach(function(sample) {
    Object.keys(sample).forEach(function(key) {
      if (-1 === keyList.indexOf(key)) {
        keyList.push(key);
      }
    });
  });

  json2csv({data: sampleList, fields: keyList}, function(err, csv) {
    assert.equal(err, null);

    fs.writeFile(htmlPath + 'data.csv', csv, function(err) {
      assert.equal(err, null);

      console.log('Starting web server at: http://localhost:8080/');
      connect().use(serveStatic(htmlPath)).listen(8080);
    });
  });
};


exports.plot = plot;
