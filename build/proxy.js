'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tracer = require('opentracing').Tracer;
var NoopTracer = require('./noop');
var DatadogTracer = require('./tracer');
var Config = require('./config');

var noop = new NoopTracer();

var TracerProxy = function (_Tracer) {
  _inherits(TracerProxy, _Tracer);

  function TracerProxy() {
    _classCallCheck(this, TracerProxy);

    var _this = _possibleConstructorReturn(this, (TracerProxy.__proto__ || Object.getPrototypeOf(TracerProxy)).call(this));

    _this._tracer = noop;
    return _this;
  }

  _createClass(TracerProxy, [{
    key: 'init',
    value: function init(options) {
      if (this._tracer === noop) {
        var config = new Config(options);
        this._tracer = new DatadogTracer(config);
      }

      return this;
    }
  }, {
    key: 'trace',
    value: function trace() {
      return this._tracer.trace.apply(this._tracer, arguments);
    }
  }, {
    key: 'startSpan',
    value: function startSpan() {
      return this._tracer.startSpan.apply(this._tracer, arguments);
    }
  }, {
    key: 'inject',
    value: function inject() {
      return this._tracer.inject.apply(this._tracer, arguments);
    }
  }, {
    key: 'extract',
    value: function extract() {
      return this._tracer.extract.apply(this._tracer, arguments);
    }
  }, {
    key: 'currentSpan',
    value: function currentSpan() {
      return this._tracer.currentSpan.apply(this._tracer, arguments);
    }
  }, {
    key: 'bind',
    value: function bind() {
      return this._tracer.bind.apply(this._tracer, arguments);
    }
  }, {
    key: 'bindEmitter',
    value: function bindEmitter() {
      return this._tracer.bindEmitter.apply(this._tracer, arguments);
    }
  }]);

  return TracerProxy;
}(Tracer);

module.exports = TracerProxy;