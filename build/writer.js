'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var platform = require('./platform');
var log = require('./log');
var format = require('./format');
var encode = require('./encode');
var tracerVersion = require('../lib/version');

var Writer = function () {
  function Writer(url, size) {
    _classCallCheck(this, Writer);

    this._queue = [];
    this._url = url;
    this._size = size;
  }

  _createClass(Writer, [{
    key: 'append',
    value: function append(span) {
      var trace = span.context().trace;

      if (trace.started.length === trace.finished.length) {
        var buffer = encode(trace.finished.map(format));

        if (this.length < this._size) {
          this._queue.push(buffer);
        } else {
          this._squeeze(buffer);
        }
      }
    }
  }, {
    key: 'flush',
    value: function flush() {
      if (this._queue.length > 0) {
        var data = platform.msgpack.prefix(this._queue);

        platform.request({
          protocol: this._url.protocol,
          hostname: this._url.hostname,
          port: this._url.port,
          path: '/v0.3/traces',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/msgpack',
            'Datadog-Meta-Lang': platform.name(),
            'Datadog-Meta-Lang-Version': platform.version(),
            'Datadog-Meta-Lang-Interpreter': platform.engine(),
            'Datadog-Meta-Tracer-Version': tracerVersion,
            'X-Datadog-Trace-Count': String(this._queue.length)
          },
          data: data
        }).catch(function (e) {
          return log.error(e);
        });

        this._queue = [];
      }
    }
  }, {
    key: '_squeeze',
    value: function _squeeze(buffer) {
      var index = Math.floor(Math.random() * this.length);
      this._queue[index] = buffer;
    }
  }, {
    key: 'length',
    get: function get() {
      return this._queue.length;
    }
  }]);

  return Writer;
}();

module.exports = Writer;