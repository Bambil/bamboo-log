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
  process.env.I1820__HOST = '127.0.0.1'
}

if (!process.env.I1820_CONNECTIVITY_PORT) {
  process.env.I1820_CONNECTIVITY_PORT = 1883
}

/* winston.js */
const winston = require('winston')

/* Configure CLI output on the default logger */
winston.cli()
winston.info(' * 18.20 at Sep 07 2016 7:20 IR721')

/* I1820 component initiation */
const I1820Component = require('./src/component')
new I1820Component({
  host: process.env.I1820_CONNECTIVITY_HOST,
  port: process.env.I1820_CONNECTIVITY_HOST,
  name: 'log',
  subscribes: ['log']
}).on('ready', () => {
  winston.info(` * MQTT at ${process.env.I1820_CONNECTIVITY_HOST}:${process.env.I1820_CONNECTIVITY_PORT}`)
})
