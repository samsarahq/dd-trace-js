'use strict';

module.exports = function (name) {
  return process.env[name];
};