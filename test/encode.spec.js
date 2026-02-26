'use strict'

const msgpack = require('@msgpack/msgpack')
const Uint64BE = require('int64-buffer').Uint64BE

describe('encode', () => {
  let encode

  beforeEach(() => {
    encode = require('../src/encode')
  })

  it('should encode to msgpack', () => {
    const data = [{
      id: new Uint64BE(0x12345678, 0x12345678),
      name: 'test'
    }]

    const buffer = encode(data)
    const decoded = msgpack.decode(buffer, { useBigInt64: true })

    expect(decoded).to.be.instanceof(Array)
    expect(decoded[0]).to.be.instanceof(Object)
    expect(typeof decoded[0].id).to.equal('bigint')
    expect(decoded[0].id.toString()).to.equal(data[0].id.toString())
    expect(decoded[0].name).to.equal(data[0].name)
  })
})
