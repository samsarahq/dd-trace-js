'use strict';

var Uint64BE = require('int64-buffer').Uint64BE;
var randomBytes = require('crypto').randomBytes;

module.exports = function () {
  return new Uint64BE(randomBytes(8));
};