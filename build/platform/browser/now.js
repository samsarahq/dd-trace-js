'use strict';

module.exports = nowMilli();

// The following snippet is mostly copied from the lightstep-tracer-javascript repo. One difference for our
// implementation is that we measure our performance in milliseconds rather than microseconds.
// We are currently evaluating lightstep and want to be consistent with how we are gathering our duration metrics.
// source: https://github.com/lightstep/lightstep-tracer-javascript/blob/c642dd59b4ed13e8832c27345b382f5dbd2a35eb/src/imp/platform/browser/platform_browser.js#L8
let nowMilli = (function () {
  // Is a hi-res timer available?
  if (window.performance &&
      window.performance.now &&
      window.performance.timing &&
      window.performance.timing.navigationStart) {
      let start = performance.timing.navigationStart;
      return function () {
          return Math.floor((start + performance.now()));
      };
  }
  // The low-res timer is the best we can do
  return function () {
      return Date.now();
  };
}());
