'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var http = require('http');

function request(options, callback) {
  options = Object.assign({
    headers: {}
  }, options);

  options.headers['Content-Type'] = 'application/json';

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    var url = options.protocol + '//' + options.hostname + ':' + options.port + options.path;

    xhr.onload = function () {
      if (this.status >= 200 && this.status <= 299) {
        resolve();
      }
    };
    xhr.onerror = function () {
      return reject(new TypeError('network request failed'));
    };
    xhr.ontimeout = function () {
      return reject(new TypeError('network request timed out'));
    };

    xhr.open(options.method, url, true);

    Object.entries(options.headers).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      xhr.setRequestHeader(k, v);
    });

    xhr.send(options.data);
  });
}

module.exports = request;