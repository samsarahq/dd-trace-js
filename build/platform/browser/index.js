'use strict';

var id = require('./id');
var now = require('./now');
var request = require('./request');
var context = require('./context');
var msgpack = require('./msgpack');

module.exports = {
  name: function name() {
    return 'browser';
  },
  version: function version() {
    return navigator.userAgent;
  },
  engine: function engine() {
    return 'browser';
  },
  id: id,
  now: now,
  request: request,
  context: context,
  msgpack: msgpack
};
