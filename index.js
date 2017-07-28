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
if (!process.env.BAMBOO_CONNECTIVITY_HOST) {
  process.env.BAMBOO_CONNECTIVITY_HOST = '127.0.0.1'
}

if (!process.env.BAMBOO_CONNECTIVITY_PORT) {
  process.env.BAMBOO_CONNECTIVITY_PORT = 1883
}

if (!process.env.BAMBOO_HTTP_HOST) {
  process.env.BAMBOO_HTTP_HOST = '0.0.0.0'
}

if (!process.env.BAMBOO_HTTP_PORT) {
  process.env.BAMBOO_HTTP_PORT = 8080
}

if (!process.env.BAMBOO_DATABASE_NAME) {
  process.env.BAMBOO_DATABASE_NAME = 'Bamboo'
}

if (!process.env.BAMBOO_DATABASE_HOST) {
  process.env.BAMBOO_DATABASE_HOST = '127.0.0.1'
}

/* winston.js */
const winston = require('winston')

/* Configure CLI output on the default logger */
winston.cli()
winston.info(' * 18.20 at Sep 07 2016 7:20 IR721')

/* Bamboo Log Initiation */
const BambooLog = require('./src/log')

const bambooLog = new BambooLog({
  database: process.env.BAMBOO_DATABASE_NAME,
  host: process.env.BAMBOO_DATABASE_HOST
})

/* Bamboo component initiation */
const BambooComponent = require('@ibamboo/component')

new BambooComponent({
  mqttHost: process.env.BAMBOO_CONNECTIVITY_HOST,
  mqttPort: process.env.BAMBOO_CONNECTIVITY_PORT,
  name: 'log',
  subscribes: ['log']
}).on('ready', () => {
  winston.info(` * MQTT at ${process.env.BAMBOO_CONNECTIVITY_HOST}:${process.env.BAMBOO_CONNECTIVITY_PORT}`)
}).on('log', (message) => {
  winston.data(message)
  bambooLog.log(`${message.tenant}/${message.name}`, message.data.id, message.data.timestamp, message.data.state)
})

/* HTTP server initiation */
const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  host: process.env.BAMBOO_HTTP_HOST,
  port: process.env.BAMBOO_HTTP_PORT
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
      bambooLog.fetch(request.payload['agent_id'], request.payload['thing_id'], s)
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
