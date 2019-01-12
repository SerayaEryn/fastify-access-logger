'use strict'

const eachAsync = require('each-async')
const RequestDataFactory = require('./RequestDataFactory')

const startTime = Symbol('startTime')
const payloadSize = Symbol('payloadSize')

class AccessLogger {
  constructor (options) {
    this.requestDataFactory = new RequestDataFactory(options)
    this.transports = options.transports
  }

  log (request, reply) {
    const line = this.requestDataFactory.formatLogLine(
      request,
      reply,
      request[startTime],
      reply[payloadSize]
    )
    for (const transport of this.transports) {
      transport.write(line)
    }
  }

  end (callback) {
    eachAsync(this.transports, (transport, index, cb) => {
      transport.on('finish', cb)
      transport.end()
    }, callback)
  }
}

module.exports = {
  AccessLogger,
  payloadSize,
  startTime
}
