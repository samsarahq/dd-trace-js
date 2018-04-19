'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var url = require('url');
var opentracing = require('opentracing');
var shimmer = require('shimmer');

var Tags = opentracing.Tags;
var FORMAT_HTTP_HEADERS = opentracing.FORMAT_HTTP_HEADERS;

function patch(http, tracer) {
  shimmer.wrap(http, 'request', function (request) {
    return makeRequestTrace(request);
  });
  shimmer.wrap(http, 'get', function (get) {
    return makeRequestTrace(get);
  });

  function makeRequestTrace(request) {
    return function requestTrace(options, callback) {
      var _tags,
          _this = this;

      var uri = extractUrl(options);
      var method = options.method || 'GET';

      if (uri === tracer._url.href + '/v0.3/traces') {
        return request.apply(this, [options, callback]);
      }

      var req = void 0;

      tracer.trace('http.request', {
        tags: (_tags = {}, _defineProperty(_tags, Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT), _defineProperty(_tags, Tags.HTTP_URL, uri), _defineProperty(_tags, Tags.HTTP_METHOD, method), _tags)
      }, function (span) {
        var isFinish = false;

        options = typeof options === 'string' ? url.parse(uri) : Object.assign({}, options);
        options.headers = options.headers || {};

        span.addTags({
          'service.name': 'http-client',
          'span.type': 'web',
          'resource.name': options.pathname
        });

        tracer.inject(span, FORMAT_HTTP_HEADERS, options.headers);

        function finish() {
          if (!isFinish) {
            isFinish = true;
            span.finish();
          }
        }

        req = request.call(_this, options, function (res) {
          span.setTag(Tags.HTTP_STATUS_CODE, res.statusCode);
          res.on('end', finish);
          callback && callback(res);
        });

        req.on('socket', function (socket) {
          socket.on('close', finish);
        });

        req.on('error', function (err) {
          span.addTags({
            'error.type': err.name,
            'error.msg': err.message,
            'error.stack': err.stack
          });

          span.finish();
        });
      });

      return req;
    };
  }

  function extractUrl(options) {
    var uri = options;
    var agent = options.agent || http.globalAgent;

    return typeof uri === 'string' ? uri : url.format({
      protocol: options.protocol || agent.protocol,
      hostname: options.hostname || options.host || 'localhost',
      port: options.port,
      pathname: options.path || options.pathname || '/'
    });
  }
}

function unpatch(http) {
  shimmer.unwrap(http, 'request');
  shimmer.unwrap(http, 'get');
}

module.exports = {
  name: 'http',
  patch: patch,
  unpatch: unpatch
};