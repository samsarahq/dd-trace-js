'use strict';

var msgpack = require('msgpack-lite');
var codec = msgpack.createCodec({ int64: true });

module.exports = function (data) {
  return msgpack.encode(data, { codec: codec });
};