'use strict';

module.exports = {
  use: function use(impl) {
    Object.assign(this, impl);
  }
};