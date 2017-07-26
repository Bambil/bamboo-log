/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 20-07-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */
/* Configuration */
if (!process.env.I1820_CONNECTIVITY_HOST) {
  process.env.I1820_CONNECTIVITY_HOST = '127.0.0.1'
}

if (!process.env.I1820_CONNECTIVITY_PORT) {
  process.env.I1820_CONNECTIVITY_PORT = 1883
}

if (!process.env.I1820_HTTP_HOST) {
  process.env.I1820_HTTP_HOST = '0.0.0.0'
}

if (!process.env.I1820_HTTP_PORT) {
  process.env.I1820_HTTP_PORT = 8080
}

if (!process.env.I1820_DATABASE_NAME) {
  process.env.I1820_DATABASE_NAME = 'I1820'
}

if (!process.env.I1820_DATABASE_HOST) {
  process.env.I1820_DATABASE_HOST = '127.0.0.1'
}

/* winston.js */
const winston = require('winston')

/* Configure CLI output on the default logger */
winston.cli()
winston.info(' * 18.20 at Sep 07 2016 7:20 IR721')

/* I1820 Log Initiation */
const I1820Log = require('./src/log')

const i1820Log = new I1820Log({
  database: process.env.I1820_DATABASE_NAME,
  host: process.env.I1820_DATABASE_HOST
})

/* I1820 component initiation */
const I1820Component = require('@ibamboo/component')

new I1820Component({
  mqttHost: process.env.I1820_CONNECTIVITY_HOST,
  mqttPort: process.env.I1820_CONNECTIVITY_PORT,
  name: 'log',
  subscribes: ['log']
}).on('ready', () => {
  winston.info(` * MQTT at ${process.env.I1820_CONNECTIVITY_HOST}:${process.env.I1820_CONNECTIVITY_PORT}`)
}).on('log', (message) => {
  winston.data(message)
  i1820Log.log(`${message.tenant}/${message.name}`, message.data.id, message.data.timestamp, message.data.state)
})

/* HTTP server initiation */
const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  host: process.env.I1820_HTTP_HOST,
  port: process.env.I1820_HTTP_PORT
})

server.route({
  method: 'POST',
  path: '/thing',
  config: {
    payload: {
      parse: true
    }
  },
  handler: function (request, reply) {
    for (let s of request.payload['states']) {
      i1820Log.fetch(request.payload['agent_id'], request.payload['thing_id'], s)
    }
    return reply('hello world')
  }
})

server.start((err) => {
  if (err) {
    winston.error(err)
  }
  winston.info(` * HTTP at ${server.info.uri}`)
})
