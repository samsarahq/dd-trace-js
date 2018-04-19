'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requireDir = require('require-dir');
var path = require('path');
var semver = require('semver');
var hook = require('require-in-the-middle');

var Instrumenter = function () {
  function Instrumenter(tracer, config) {
    _classCallCheck(this, Instrumenter);

    this._tracer = tracer;
    this._plugins = loadPlugins(config);
    this._instrumented = new Map();
  }

  _createClass(Instrumenter, [{
    key: 'patch',
    value: function patch() {
      var instrumentedModules = this._plugins.map(function (plugin) {
        return plugin.name;
      });
      hook(instrumentedModules, this.hookModule.bind(this));
    }
  }, {
    key: 'unpatch',
    value: function unpatch() {
      this._instrumented.forEach(function (instrumentation, moduleExports) {
        instrumentation.unpatch(moduleExports);
      });
    }
  }, {
    key: 'hookModule',
    value: function hookModule(moduleExports, moduleName, moduleBaseDir) {
      var _this = this;

      var moduleVersion = getVersion(moduleBaseDir);

      this._plugins.filter(function (plugin) {
        return plugin.name === moduleName;
      }).filter(function (plugin) {
        return matchVersion(moduleVersion, plugin.versions);
      }).forEach(function (plugin) {
        plugin.patch(moduleExports, _this._tracer);
        _this._instrumented.set(moduleExports, plugin);
      });

      return moduleExports;
    }
  }]);

  return Instrumenter;
}();

function loadPlugins(config) {
  if (config.plugins === false) {
    return [];
  }

  var plugins = [];
  var integrations = requireDir('./plugins');

  Object.keys(integrations).forEach(function (key) {
    plugins.push(integrations[key]);
  });

  return plugins;
}

function matchVersion(version, ranges) {
  return !version || ranges && ranges.some(function (range) {
    return semver.satisfies(version, range);
  });
}

function getVersion(moduleBaseDir) {
  if (moduleBaseDir) {
    var packageJSON = path.join(moduleBaseDir, 'package.json');
    return require(packageJSON).version;
  }
}

module.exports = Instrumenter;