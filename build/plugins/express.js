'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var opentracing = require('opentracing');
var Tags = opentracing.Tags;
var FORMAT_HTTP_HEADERS = opentracing.FORMAT_HTTP_HEADERS;
var shimmer = require('shimmer');
var METHODS = require('methods').concat('use', 'route', 'param', 'all');

var OPERATION_NAME = 'express.request';

function patch(express, tracer) {
  METHODS.forEach(function (method) {
    shimmer.wrap(express.application, method, wrapper);
  });

  function middleware(req, res, next) {
    var _tags;

    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var childOf = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    tracer.trace(OPERATION_NAME, {
      childOf: childOf,
      tags: (_tags = {}, _defineProperty(_tags, Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_SERVER), _defineProperty(_tags, Tags.HTTP_URL, url), _defineProperty(_tags, Tags.HTTP_METHOD, req.method), _tags)
    }, function (span) {
      var originalEnd = res.end;

      res.end = function () {
        res.end = originalEnd;
        var returned = res.end.apply(this, arguments);

        if (req.route && req.route.path) {
          span.setTag('resource.name', req.route.path);
        }

        span.setTag('service.name', tracer._service);
        span.setTag('span.type', 'web');
        span.setTag(Tags.HTTP_STATUS_CODE, res.statusCode);

        if (res.statusCode >= 400) {
          span.setTag(Tags.ERROR, true);
        }

        span.finish();

        return returned;
      };

      return next();
    });
  }

  function wrapper(original) {
    return function () {
      if (!this._datadog_trace_patched && !this._router) {
        this._datadog_trace_patched = true;
        this.use(middleware);
      }
      return original.apply(this, arguments);
    };
  }
}

function unpatch(express) {
  METHODS.forEach(function (method) {
    shimmer.unwrap(express.application, method);
  });
}

module.exports = {
  name: 'express',
  versions: ['4.x'],
  patch: patch,
  unpatch: unpatch
};