'use strict';

var cls = require('cls-hooked');
var clsBluebird = require('cls-bluebird');
var namespace = cls.createNamespace('dd-trace');

clsBluebird(namespace);

module.exports = namespace;