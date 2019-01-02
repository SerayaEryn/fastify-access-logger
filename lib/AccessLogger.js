'use strict'

const eachAsync = require('each-async')
const RequestDataFactory = require('./RequestDataFactory')

module.exports = class AccessLogger {
  constructor (options) {
    this.requestDataFactory = new RequestDataFactory()
    this.transports = options.transports
  }

  log (request, reply) {
    const line = this.requestDataFactory.buildLine(request, reply)
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
