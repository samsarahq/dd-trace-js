'use strict';

module.exports = function (config) {
  var namespace = void 0;

  if (config.experimental.asyncHooks) {
    namespace = require('./cls_hooked');
  } else {
    namespace = require('./cls');
  }

  return namespace;
};