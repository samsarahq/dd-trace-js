'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var opentracing = require('opentracing');
var Span = opentracing.Span;
var SpanContext = require('./span_context');
var platform = require('../platform');

var DatadogSpan = function (_Span) {
  _inherits(DatadogSpan, _Span);

  function DatadogSpan(tracer, fields) {
    _classCallCheck(this, DatadogSpan);

    var _this = _possibleConstructorReturn(this, (DatadogSpan.__proto__ || Object.getPrototypeOf(DatadogSpan)).call(this));

    var startTime = fields.startTime || platform.now();
    var operationName = fields.operationName;
    var parent = fields.parent || null;
    var tags = fields.tags || {};

    _this._parentTracer = tracer;
    _this._operationName = operationName;
    _this._tags = Object.assign({}, tags);
    _this._startTime = startTime;

    _this._spanContext = _this._createContext(parent);
    return _this;
  }

  _createClass(DatadogSpan, [{
    key: '_createContext',
    value: function _createContext(parent) {
      var spanContext = void 0;

      if (parent) {
        spanContext = new SpanContext({
          traceId: parent.traceId,
          spanId: platform.id(),
          parentId: parent.spanId,
          sampled: parent.sampled,
          baggageItems: Object.assign({}, parent.baggageItems),
          trace: parent.trace
        });
      } else {
        var spanId = platform.id();
        spanContext = new SpanContext({
          traceId: spanId,
          spanId: spanId,
          sampled: this._parentTracer._isSampled(this)
        });
      }

      spanContext.trace.started.push(this);

      return spanContext;
    }
  }, {
    key: '_context',
    value: function _context() {
      return this._spanContext;
    }
  }, {
    key: '_tracer',
    value: function _tracer() {
      return this._parentTracer;
    }
  }, {
    key: '_setOperationName',
    value: function _setOperationName(name) {
      this._operationName = name;
    }
  }, {
    key: '_setBaggageItem',
    value: function _setBaggageItem(key, value) {
      this._spanContext.baggageItems[key] = value;
    }
  }, {
    key: '_getBaggageItem',
    value: function _getBaggageItem(key) {
      return this._spanContext.baggageItems[key];
    }
  }, {
    key: '_addTags',
    value: function _addTags(keyValuePairs) {
      var _this2 = this;

      Object.keys(keyValuePairs).forEach(function (key) {
        _this2._tags[key] = String(keyValuePairs[key]);
      });
    }
  }, {
    key: '_finish',
    value: function _finish(finishTime) {
      finishTime = finishTime || platform.now();

      this._duration = finishTime - this._startTime;
      this._spanContext.trace.finished.push(this);

      if (this._spanContext.sampled) {
        this._parentTracer._record(this);
      }
    }
  }]);

  return DatadogSpan;
}(Span);

module.exports = DatadogSpan;