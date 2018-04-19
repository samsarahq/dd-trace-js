'use strict'

const platform = require('./build/platform')
const browser = require('./build/platform/browser')
const TracerProxy = require('./build/proxy')

platform.use(browser)

module.exports = new TracerProxy()
