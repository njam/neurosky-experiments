#!/usr/bin/env node

var sha1 = require('sha1');
var thinkgear = require('../lib/thinkgear/client');

var client = thinkgear.create({
  appName: 'foo',
  appKey: sha1('foo'),
  enableRawOutput: false
});

client.on('data', function (data) {
  console.log(data);
});

client.on('error', function (error) {
  console.log(error);
});

client.on('close', function () {
  console.log('closing.');
});

client.connect();
