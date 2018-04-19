'use strict';

// TODO: flush on process exit

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scheduler = function () {
  function Scheduler(callback, interval) {
    _classCallCheck(this, Scheduler);

    this._timer = null;
    this._callback = callback;
    this._interval = interval;
  }

  _createClass(Scheduler, [{
    key: 'start',
    value: function start() {
      this._timer = setInterval(this._callback, this._interval);
      this._timer.unref && this._timer.unref();
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this._timer);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.stop();
      this.start();
    }
  }]);

  return Scheduler;
}();

module.exports = Scheduler;