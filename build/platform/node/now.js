'use strict';

var now = require('performance-now');
var loadNs = now();
var loadMs = Date.now();

module.exports = function () {
  return loadMs + now() - loadNs;
};