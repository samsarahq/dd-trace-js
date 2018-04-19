'use strict';

var cls = require('continuation-local-storage');
var clsBluebird = require('cls-bluebird');
var namespace = cls.createNamespace('dd-trace');

clsBluebird(namespace);

module.exports = namespace;