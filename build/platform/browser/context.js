'use strict';

var context = new Map();

module.exports = function (config) {
  return {
    get: function get() {
      return context.get.apply(context, arguments);
    },
    set: function set() {
      return context.set.apply(context, arguments);
    },
    bind: function bind(fn) {
      return fn;
    },
    bindEmitter: function bindEmitter() {}
  };
};