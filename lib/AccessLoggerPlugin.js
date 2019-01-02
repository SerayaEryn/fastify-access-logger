'use strict'

const AccessLogger = require('./AccessLogger')
const metadata = require('./Metadata')
const fastifyPlugin = require('fastify-plugin')

function accessLoggerPlugin (instance, options, next) {
  if (!options.transports || options.transports.length === 0) {
    return next(new Error('At least one transport is required'))
  }
  const accessLogger = new AccessLogger(options)
  instance.decorateRequest('startTime', null)
  instance.decorateReply('payloadSize', null)
  instance.addHook('onRequest', onRequest)
  instance.addHook('onSend', onSend)
  instance.addHook('onResponse', onResponse(accessLogger))
  instance.addHook('onClose', onClose(accessLogger))
  next()
}

function onRequest (request, reply, next) {
  request.startTime = Date.now()
  next()
}

function onSend (request, reply, payload, next) {
  if (typeof payload === 'string') {
    reply.payloadSize = payload.length
  }
  next()
}

function onResponse (accessLogger) {
  return function log (request, reply, next) {
    accessLogger.log(request, reply)
    next()
  }
}

function onClose (accessLogger) {
  return function end (instance, done) {
    accessLogger.end(done)
  }
}

module.exports = fastifyPlugin(accessLoggerPlugin, metadata)
