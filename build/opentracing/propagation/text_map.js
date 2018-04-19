'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Uint64BE = require('int64-buffer').Uint64BE;
var DatadogSpanContext = require('../span_context');

var traceKey = 'x-datadog-trace-id';
var spanKey = 'x-datadog-parent-id';
var baggagePrefix = 'ot-baggage-';
var baggageExpr = new RegExp('^' + baggagePrefix + '(.+)$');

var TextMapPropagator = function () {
  function TextMapPropagator() {
    _classCallCheck(this, TextMapPropagator);
  }

  _createClass(TextMapPropagator, [{
    key: 'inject',
    value: function inject(spanContext, carrier) {
      carrier[traceKey] = spanContext.traceId.toString();
      carrier[spanKey] = spanContext.spanId.toString();

      spanContext.baggageItems && Object.keys(spanContext.baggageItems).forEach(function (key) {
        carrier[baggagePrefix + key] = String(spanContext.baggageItems[key]);
      });
    }
  }, {
    key: 'extract',
    value: function extract(carrier) {
      var baggageItems = {};

      Object.keys(carrier).forEach(function (key) {
        var match = key.match(baggageExpr);

        if (match) {
          baggageItems[match[1]] = carrier[key];
        }
      });

      return new DatadogSpanContext({
        traceId: new Uint64BE(carrier[traceKey], 10),
        spanId: new Uint64BE(carrier[spanKey], 10),
        baggageItems: baggageItems
      });
    }
  }]);

  return TextMapPropagator;
}();

module.exports = TextMapPropagator;