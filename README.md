# fastify-access-logger

[![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/fastify-access-logger.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/SerayaEryn/fastify-access-logger.svg?branch=master)](https://travis-ci.org/SerayaEryn/fastify-access-logger)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/fastify-access-logger/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/fastify-access-logger?branch=master)
[![NPM version](https://img.shields.io/npm/v/fastify-access-logger.svg?style=flat)](https://www.npmjs.com/package/fastify-access-logger)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

An access logger plugin for [fastify](http://fastify.io/).

## Installation

```
npm i fastify-access-logger
```

## Example

```js
const fastifyAccessLogger = require('fastify-access-logger')
const fastify = require('fastify')()

const options = {
  transports: [process.stdout]
}
fastify.register(fastifyAccessLogger, options)
fastify.get('/test', (request, reply) => {
  reply.send(200)
})

fastify.listen(0)
```

## API


### fastifyAccessLogger(fastify, options, next)

The access logger plugin logs a line in the following format for every request:

```bash
ip date method url parameters status duration size 
```
Example:
```
127.0.0.1 [02/Jan/2019:17:37:12 +0100] GET /test - 200 3 3
```
The access logger plugin accepts the following options:

#### transports

An array of [Writable](https://nodejs.org/api/stream.html#stream_class_stream_writable) streams.

## License

[MIT](./LICENSE)