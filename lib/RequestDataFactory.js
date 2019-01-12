'use strict'

const DateFormatter = require('fast-date-format')
const generateFunction = require('generate-function')

const buildLogLineFormatter = Symbol('buildLogLineFormatter')
const tokenize = Symbol('tokenize')
const FORMAT = 'IP DATE METHOD URL PARAMETERS STATUS DURATION SIZE'
const DATE_FORMAT = '[[]DD/MMM/YYYY:HH:mm:ss Z[]]'

module.exports = class RequestDataFactory {
  constructor (options) {
    const dataFormat = options.dataFormat || DATE_FORMAT
    const format = options.format || FORMAT
    this.dateFormatter = new DateFormatter(dataFormat)
    this.tokenToCode = {
      IP: 'const IP = request.raw.connection.remoteAddress || \'-\'',
      DATE: 'const DATE = this.dateFormatter.format(now)',
      METHOD: 'const METHOD = request.raw.method',
      URL: 'const URL = urlAndParameter[0]',
      PARAMETERS: 'const PARAMETERS = urlAndParameter[1] || \'-\'',
      STATUS: 'const STATUS = reply.res.statusCode',
      DURATION: 'const DURATION = now.getTime() - startTime',
      SIZE: 'const SIZE = payloadSize || \'-\''
    }
    Object.assign(this.tokenToCode, options.customTokens || {})
    this.formatLogLine = this[buildLogLineFormatter](format)
  }

  [buildLogLineFormatter] (format) {
    const tokens = this[tokenize](format)
    const gen = generateFunction()
    gen('function format (request, reply, startTime, payloadSize) {')
    if (tokens.includes('DATE') || tokens.includes('DURATION')) {
      gen('const now = new Date()')
    }
    if (tokens.includes('URL') || tokens.includes('PARAMETERS')) {
      gen('const urlAndParameter = request.raw.url.split(\'?\')')
    }
    for (const token of tokens) {
      gen(this.tokenToCode[token])
    }
    gen('return `${' + tokens.join('} ${') + '}\\n`')
    gen('}')
    return gen.toFunction().bind(this)
  }

  [tokenize] (format) {
    return format.split(' ')
  }
}
