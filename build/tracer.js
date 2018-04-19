'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var platform = require('./platform');
var Tracer = require('./opentracing/tracer');

var DatadogTracer = function (_Tracer) {
  _inherits(DatadogTracer, _Tracer);

  function DatadogTracer(config) {
    _classCallCheck(this, DatadogTracer);

    var _this = _possibleConstructorReturn(this, (DatadogTracer.__proto__ || Object.getPrototypeOf(DatadogTracer)).call(this, config));

    _this._context = platform.context(config);
    return _this;
  }

  _createClass(DatadogTracer, [{
    key: 'trace',
    value: function trace(name, options, callback) {
      var _this2 = this;

      if (!callback) {
        callback = options;
        options = {};
      }

      this._context.run(function () {
        var childOf = options.childOf || _this2._context.get('current');
        var tags = Object.assign({
          'service.name': options.service || _this2._service,
          'resource.name': options.resource || name,
          'span.type': options.type
        }, options.tags);

        var span = _this2.startSpan(name, { childOf: childOf, tags: tags });
        _this2._context.set('current', span);

        callback(span);
      });
    }
  }, {
    key: 'currentSpan',
    value: function currentSpan() {
      return this._context.get('current') || null;
    }
  }, {
    key: 'bind',
    value: function bind(callback) {
      return this._context.bind(callback);
    }
  }, {
    key: 'bindEmitter',
    value: function bindEmitter(emitter) {
      this._context.bindEmitter(emitter);
    }
  }]);

  return DatadogTracer;
}(Tracer);

module.exports = DatadogTracer;