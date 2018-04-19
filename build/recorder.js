'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scheduler = require('./scheduler');
var Writer = require('./writer');

// TODO: make calls to Writer#append asynchronous

var Recorder = function () {
  function Recorder(url, interval, size) {
    var _this = this;

    _classCallCheck(this, Recorder);

    this._writer = new Writer(url, size);
    this._scheduler = new Scheduler(function () {
      return _this._writer.flush();
    }, interval);
  }

  _createClass(Recorder, [{
    key: 'init',
    value: function init() {
      this._scheduler.start();
    }
  }, {
    key: 'record',
    value: function record(span) {
      this._writer.append(span);
    }
  }]);

  return Recorder;
}();

module.exports = Recorder;