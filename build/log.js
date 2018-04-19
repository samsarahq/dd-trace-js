'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _logger = {
  debug: function debug() {},
  error: function error() {}
};

module.exports = {
  use: function use(logger) {
    var isObject = logger && (typeof logger === 'undefined' ? 'undefined' : _typeof(logger)) === 'object';

    if (isObject && logger.debug instanceof Function && logger.error instanceof Function) {
      _logger = logger;
    }
  },
  debug: function debug(message) {
    _logger.debug(message);
  },
  error: function error(message) {
    _logger.error(message);
  }
};