'use strict'

const platform = require('./build/platform')
const node = require('./build/platform/node')
const TracerProxy = require('./build/proxy')

platform.use(node)

module.exports = new TracerProxy()
