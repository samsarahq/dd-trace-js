'use strict';

var loadNs = performance.now();
var loadMs = Date.now();

module.exports = function () {
  return loadMs + performance.now() - loadNs;
};