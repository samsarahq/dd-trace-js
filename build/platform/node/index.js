'use strict';

var id = require('./id');
var now = require('./now');
var env = require('./env');
var request = require('./request');
var context = require('./context');
var msgpack = require('./msgpack');

module.exports = {
  name: function name() {
    return 'nodejs';
  },
  version: function version() {
    return process.version;
  },
  engine: function engine() {
    return process.jsEngine || 'v8';
  },
  id: id,
  now: now,
  env: env,
  request: request,
  context: context,
  msgpack: msgpack
};