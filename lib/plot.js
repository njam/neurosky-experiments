var json2csv = require('json2csv');
var assert = require('assert');
var fs = require('fs');
var connect = require('connect');
var serveStatic = require('serve-static');

var htmlPath = __dirname + '/../html/plot/';

/**
 * @param {Array<Sample>} sampleList
 */
var plot = function(sampleList) {
  var data = sampleList.map(function(sample) {
    var row = {};
    row['time'] = sample.time.toISOString().replace(/T/, ' ');
    sample.getKeys().forEach(function(key) {
      row[key] = sample.getValue(key, Number);
    });
    return row;
  });

  var keyList = ['time'];
  sampleList.forEach(function(sample) {
    sample.getKeys().forEach(function(key) {
      if (-1 === keyList.indexOf(key)) {
        keyList.push(key);
      }
    });
  });

  json2csv({data: data, fields: keyList}, function(err, csv) {
    assert.equal(err, null);

    fs.writeFile(htmlPath + 'data.csv', csv, function(err) {
      assert.equal(err, null);

      console.log('Starting web server at: http://localhost:8080/');
      connect().use(serveStatic(htmlPath)).listen(8080);
    });
  });
};


exports.plot = plot;
