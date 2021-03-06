'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const request = require('request')
const EventEmitter = require('events')
const fastifyAccessLogger = require('..')

test('should write line to all transports', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 \[\d{2}\/[A-Z][a-z]{2}\/\d{4}:\d{2}:\d{2}:\d{2} (\+|-)\d{4}] GET \/test - 200 \d \d+.*/.test(line))
      }
    }]
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(200)
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should write line to all transports using custom format', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 GET - 200 \d \d+.*/.test(line))
      }
    }],
    format: 'IP METHOD PARAMETERS STATUS DURATION SIZE'
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(200)
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should write line to all transports using custom format', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 GET - 200 \d \d+ something.*/.test(line))
      }
    }],
    format: 'IP METHOD PARAMETERS STATUS DURATION SIZE REFERER',
    customTokens: {
      REFERER: 'const REFERER = \'something\''
    }
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(200)
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should write line to all transports using custom format', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 GET 200 \d+.*/.test(line))
      }
    }],
    format: 'IP METHOD STATUS SIZE'
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(200)
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should log url parameters', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 \[\d{2}\/[A-Z][a-z]{2}\/\d{4}:\d{2}:\d{2}:\d{2} (\+|-)\d{4}] GET \/test test=true 200 \d \d+.*/.test(line))
      }
    }]
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(200)
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test?test=true',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should handle payload != string', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(/127\.0\.0\.1 \[\d{2}\/[A-Z][a-z]{2}\/\d{4}:\d{2}:\d{2}:\d{2} (\+|-)\d{4}] GET \/test test=true 500 \d \d{2}/.test(line))
      }
    }]
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send(new Error())
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test?test=true',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 500)
    })
  })
})

test('should add newline at end of every line', (t) => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    transports: [{
      write (line) {
        t.ok(line.endsWith('\n'))
      }
    }]
  }
  fastify.register(fastifyAccessLogger, options)
  fastify.get('/test', (request, reply) => {
    reply.send('test')
  })

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()

    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test?test=true',
      headers: {
        'content-type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
    })
  })
})

test('should end access logger', (t) => {
  t.plan(3)
  const fastify = Fastify()

  class TestTransport extends EventEmitter {
    end () {
      t.pass()
      this.emit('finish')
    }
  }
  const options = {
    transports: [new TestTransport()]
  }
  fastify.register(fastifyAccessLogger, options)

  fastify.listen(0, (err) => {
    t.error(err)
    fastify.server.unref()
    fastify.close(() => {
      t.pass()
    })
  })
})

test('should throw error on missing transports #1', (t) => {
  t.plan(1)
  const fastify = Fastify()

  const options = {
    transports: []
  }

  fastify.register(fastifyAccessLogger, options)
  return fastify.ready()
    .catch((error) => t.ok(error))
})

test('should throw error on missing transports #2', (t) => {
  t.plan(1)
  const fastify = Fastify()

  const options = {}
  fastify.register(fastifyAccessLogger, options)
  return fastify.ready()
    .catch((error) => t.ok(error))
})
