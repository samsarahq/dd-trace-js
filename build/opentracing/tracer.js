'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var opentracing = require('opentracing');
var Tracer = opentracing.Tracer;
var Span = require('./span');
var Recorder = require('../recorder');
var Sampler = require('../sampler');
var TextMapPropagator = require('./propagation/text_map');
var HttpPropagator = require('./propagation/http');
var BinaryPropagator = require('./propagation/binary');
var log = require('../log');

var DatadogTracer = function (_Tracer) {
  _inherits(DatadogTracer, _Tracer);

  function DatadogTracer(config) {
    var _this$_propagators;

    _classCallCheck(this, DatadogTracer);

    var _this = _possibleConstructorReturn(this, (DatadogTracer.__proto__ || Object.getPrototypeOf(DatadogTracer)).call(this));

    log.use(config.logger);

    _this._service = config.service;
    _this._url = config.url;
    _this._recorder = new Recorder(config.url, config.flushInterval, config.bufferSize);
    _this._recorder.init();
    _this._sampler = new Sampler(1);
    _this._propagators = (_this$_propagators = {}, _defineProperty(_this$_propagators, opentracing.FORMAT_TEXT_MAP, new TextMapPropagator()), _defineProperty(_this$_propagators, opentracing.FORMAT_HTTP_HEADERS, new HttpPropagator()), _defineProperty(_this$_propagators, opentracing.FORMAT_BINARY, new BinaryPropagator()), _this$_propagators);
    return _this;
  }

  _createClass(DatadogTracer, [{
    key: '_startSpan',
    value: function _startSpan(name, fields) {
      return new Span(this, {
        operationName: fields.operationName || name,
        parent: getParent(fields.references),
        tags: fields.tags,
        startTime: fields.startTime
      });
    }
  }, {
    key: '_record',
    value: function _record(span) {
      this._recorder.record(span);
    }
  }, {
    key: '_inject',
    value: function _inject(spanContext, format, carrier) {
      this._propagators[format].inject(spanContext, carrier);
      return this;
    }
  }, {
    key: '_extract',
    value: function _extract(format, carrier) {
      return this._propagators[format].extract(carrier);
    }
  }, {
    key: '_isSampled',
    value: function _isSampled(span) {
      return this._sampler.isSampled(span);
    }
  }]);

  return DatadogTracer;
}(Tracer);

function getParent(references) {
  var parent = null;

  if (references) {
    for (var i = 0; i < references.length; i++) {
      var ref = references[i];
      if (ref.type() === opentracing.REFERENCE_CHILD_OF) {
        parent = ref.referencedContext();
        break;
      } else if (ref.type() === opentracing.REFERENCE_FOLLOWS_FROM) {
        if (!parent) {
          parent = ref.referencedContext();
        }
      }
    }
  }

  return parent;
}

module.exports = DatadogTracer;