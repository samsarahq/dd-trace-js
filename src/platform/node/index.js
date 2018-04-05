'use strict'

const id = require('./id')
const now = require('./now')
const env = require('./env')
const load = require('./load')
const meta = require('./meta')
const request = require('./request')
const context = require('./context')
const msgpack = require('./msgpack')

module.exports = {
  _meta: {},
  name: () => 'nodejs',
  version: () => process.version,
  engine: () => process.jsEngine || 'v8',
  id,
  now,
  env,
  load,
  meta,
  request,
  context,
  msgpack
}
