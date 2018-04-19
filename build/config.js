'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = require('url-parse');
var platform = require('./platform');
var coalesce = require('koalas');

var Config = function Config(options) {
  _classCallCheck(this, Config);

  options = options || {};

  var enabled = coalesce(options.enabled, platform.env('DD_TRACE_ENABLED'), true);
  var debug = coalesce(options.debug, platform.env('DD_TRACE_DEBUG'), false);
  var protocol = 'http';
  var hostname = coalesce(options.hostname, platform.env('DD_TRACE_AGENT_HOSTNAME'), 'localhost');
  var port = coalesce(options.port, platform.env('DD_TRACE_AGENT_PORT'), 8126);

  this.enabled = String(enabled) === 'true';
  this.debug = String(debug) === 'true';
  this.service = coalesce(options.service, platform.env('DD_SERVICE_NAME'));
  this.env = coalesce(options.env, platform.env('DD_ENV'));
  this.url = new URL(protocol + '://' + hostname + ':' + port);
  this.tags = coalesce(options.tags, {});
  this.flushInterval = coalesce(options.flushInterval, 2000);
  this.bufferSize = 100000;
  this.sampleRate = 1;
  this.logger = options.logger;
  this.plugins = coalesce(options.plugins, true);
  this.experimental = {
    asyncHooks: isFlagEnabled(options.experimental, 'asyncHooks')
  };
};

function isFlagEnabled(obj, prop) {
  return obj === true || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null && obj[prop];
}

module.exports = Config;