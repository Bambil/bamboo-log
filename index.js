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

/* I1820 component initiation */
const I1820Component = require('./src/component')
const I1820Log = require('./src/log')

const i1820Log = new I1820Log({
  database: process.env.I1820_DATABASE_NAME,
  host: process.env.I1820_DATABASE_HOST
})

new I1820Component({
  host: process.env.I1820_CONNECTIVITY_HOST,
  port: process.env.I1820_CONNECTIVITY_PORT,
  name: 'log',
  subscribes: ['log']
}).on('ready', () => {
  winston.info(` * MQTT at ${process.env.I1820_CONNECTIVITY_HOST}:${process.env.I1820_CONNECTIVITY_PORT}`)
}).on('log', (message) => {
  winston.data(message)
  i1820Log.log(message.hash, message.id, message.type, message.timestamp, message.state)
})
