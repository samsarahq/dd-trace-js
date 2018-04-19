'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Tags = require('opentracing').Tags;
var shimmer = require('shimmer');

var OPERATION_NAME = 'pg.query';

function patch(pg, tracer) {
  function queryWrap(query) {
    return function queryTrace() {
      var pgQuery = query.apply(this, arguments);
      var originalCallback = pgQuery.callback;
      var statement = pgQuery.text;
      var params = this.connectionParameters;

      pgQuery.callback = function (err, res) {
        var _tags;

        tracer.trace(OPERATION_NAME, {
          tags: (_tags = {}, _defineProperty(_tags, Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT), _defineProperty(_tags, Tags.DB_TYPE, 'postgres'), _tags)
        }, function (span) {
          span.setTag('service.name', 'postgres');
          span.setTag('resource.name', statement);
          span.setTag('db.name', params.database);
          span.setTag('db.user', params.user);
          span.setTag('out.host', params.host);
          span.setTag('out.port', String(params.port));
          span.setTag('span.type', 'db');

          if (err) {
            span.setTag(Tags.ERROR, true);
          }

          span.finish();

          if (originalCallback) {
            originalCallback(err, res);
          }
        });
      };

      return pgQuery;
    };
  }

  shimmer.wrap(pg.Client.prototype, 'query', queryWrap);
}

function unpatch(pg) {
  shimmer.unwrap(pg.Client.prototype, 'query');
}

module.exports = {
  name: 'pg',
  versions: ['6.x'],
  patch: patch,
  unpatch: unpatch
};