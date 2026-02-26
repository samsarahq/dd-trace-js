'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const getPort = require('get-port')
const msgpack = require('@msgpack/msgpack')

describe('dd-trace', () => {
  let tracer
  let agent
  let listener

  beforeEach(() => {
    tracer = require('../')

    return getPort().then(port => {
      agent = express()
      listener = agent.listen()

      tracer.init({
        service: 'test',
        port: listener.address().port,
        flushInterval: 10,
        plugins: false
      })
    })
  })

  afterEach(() => {
    listener.close()
    delete require.cache[require.resolve('../')]
  })

  it('should record and send a trace to the agent', done => {
    let span
    const options = {
      resource: '/hello/:name'
    }

    agent.use(bodyParser.raw({ type: 'application/msgpack' }))
    agent.put('/v0.3/traces', (req, res) => {
      const payload = msgpack.decode(req.body, { useBigInt64: true })

      expect(typeof payload[0][0].trace_id).to.equal('bigint')
      expect(payload[0][0].trace_id.toString()).to.equal(span.context().traceId.toString())
      expect(typeof payload[0][0].span_id).to.equal('bigint')
      expect(payload[0][0].span_id.toString()).to.equal(span.context().spanId.toString())
      expect(payload[0][0].service).to.equal('test')
      expect(payload[0][0].name).to.equal('hello')
      expect(payload[0][0].resource).to.equal('/hello/:name')
      expect(typeof payload[0][0].start).to.equal('bigint')
      expect(typeof payload[0][0].duration).to.equal('bigint')

      res.status(200).send('OK')

      done()
    })

    tracer.trace('hello', options, current => {
      span = current
      current.finish()
    })
  })
})
