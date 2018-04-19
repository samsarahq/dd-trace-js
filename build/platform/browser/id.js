'use strict';

var Uint64BE = require('int64-buffer').Uint64BE;
var crypto = window.crypto || window.msCrypto;

var buffer = new Uint32Array(2);
module.exports = function () {
  crypto.getRandomValues(buffer);
  return new Uint64BE(buffer[0] | buffer[1] << 32);
};