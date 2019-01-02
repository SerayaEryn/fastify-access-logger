'use strict'

const DateFormatter = require('fast-date-format')

module.exports = class RequestDataFactory {
  constructor () {
    this.dateFormatter = new DateFormatter('[[]DD/MMM/YYYY:HH:mm:ss Z[]]')
  }

  buildLine (request, reply) {
    const now = new Date()
    const { url, method, connection } = request.raw
    const [ urlWithoutParameters, urlParameters ] = url.split('?')
    const duration = now.getTime() - request.startTime
    const size = reply.payloadSize || '-'
    const { statusCode } = reply.res
    const formattedDate = this.dateFormatter.format(now)
    const ip = connection.remoteAddress || '-'
    return `${ip} ${formattedDate} ${method} ${urlWithoutParameters} ${urlParameters || '-'} ${statusCode} ${duration} ${size}`
  }
}
