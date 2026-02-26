'use strict';

var msgpack = require('@msgpack/msgpack');
var Buffer = require('safe-buffer').Buffer;
var Int64Buffer = require('int64-buffer');

var int64Constructors = [Int64Buffer.Int64BE, Int64Buffer.Int64LE, Int64Buffer.Uint64BE, Int64Buffer.Uint64LE];

function toBigInt(value) {
  if (typeof global.BigInt !== 'function') {
    throw new Error('BigInt support is required to encode 64-bit values');
  }

  return global.BigInt(value.toString());
}

function normalize(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  for (var i = 0; i < int64Constructors.length; i++) {
    if (value instanceof int64Constructors[i]) {
      return toBigInt(value);
    }
  }

  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return value;
  }

  var normalized = {};
  var keys = Object.keys(value);

  for (var _i = 0; _i < keys.length; _i++) {
    var key = keys[_i];
    normalized[key] = normalize(value[key]);
  }

  return normalized;
}

module.exports = function (data) {
  return Buffer.from(msgpack.encode(normalize(data), { useBigInt64: true }));
};