'use strict';

var http = require('http');

function request(options, callback) {
  options = Object.assign({
    headers: {},
    data: [],
    timeout: 2000
  }, options);

  var data = [].concat(options.data);

  options.headers['Content-Length'] = byteLength(data);

  return new Promise(function (resolve, reject) {
    var req = http.request(options, function (res) {
      res.on('data', function (chunk) {});
      res.on('end', function () {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve();
        } else {
          var error = new Error(http.STATUS_CODES[res.statusCode]);
          error.status = res.statusCode;

          reject(new Error('Error from the agent: ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode]));
        }
      });
    });

    req.setTimeout(options.timeout, req.abort);
    req.on('error', function (e) {
      return reject(new Error('Network error trying to reach the agent: ' + e.message));
    });

    data.forEach(function (buffer) {
      return req.write(buffer);
    });

    req.end();
  });
}

function byteLength(data) {
  return data.length > 0 ? data.reduce(function (prev, next) {
    return prev + next.length;
  }, 0) : 0;
}

module.exports = request;