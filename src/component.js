/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 04-06-2017
 * |
 * | File Name:     component.js
 * +===============================================
 */
const mqtt = require('mqtt')
const winston = require('winston')
const crypto = require('crypto')
const EventEmitter = require('events')

class I1820Component extends EventEmitter {
  constructor (options) {
    super()

    this.mqttClient = mqtt.connect(`mqtt://${options.host}:${options.port}`, {
      clientId: `I1820/${options.name}/${crypto.randomBytes(34).toString('hex')}`
    })

    this.mqttClient.on('connect', () => {
      winston.info(` * MQTT at ${options.host}:${options.port}`)
      this.mqttClient.subscribe(`I1820/${options.name}`)
      this.emit('ready')
    })

    this.mqttClient.on('error', (err) => {
      winston.error(err)
    })

    this.mqttClient.on('message', (topic, message) => {
    })
  }
}

module.exports = I1820Component
