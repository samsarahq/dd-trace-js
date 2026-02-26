'use strict'

const msgpack = require('@msgpack/msgpack')
const Buffer = require('safe-buffer').Buffer
const Int64Buffer = require('int64-buffer')

const int64Constructors = [
  Int64Buffer.Int64BE,
  Int64Buffer.Int64LE,
  Int64Buffer.Uint64BE,
  Int64Buffer.Uint64LE
]

function toBigInt (value) {
  if (typeof global.BigInt !== 'function') {
    throw new Error('BigInt support is required to encode 64-bit values')
  }

  return global.BigInt(value.toString())
}

function normalize (value) {
  if (!value || typeof value !== 'object') {
    return value
  }

  for (const Constructor of int64Constructors) {
    if (value instanceof Constructor) {
      return toBigInt(value)
    }
  }

  if (Array.isArray(value)) {
    return value.map(normalize)
  }

  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return value
  }

  const normalized = {}

  for (const key of Object.keys(value)) {
    normalized[key] = normalize(value[key])
  }

  return normalized
}

module.exports = data => Buffer.from(msgpack.encode(normalize(data), { useBigInt64: true }))
