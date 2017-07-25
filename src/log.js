/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 27-06-2017
 * |
 * | File Name:     log.js
 * +===============================================
 */
const Influx = require('influx')
const winston = require('winston')

class I1820Log {
  constructor (options) {
    this.influx = new Influx.InfluxDB({
      host: options.host,
      database: options.database
    })

    this.influx.createDatabase(options.database).then(() => {
      winston.log(' * influx db created.')
    })
  }

  log (agentId, thingId, timestamp, states) {
    const points = []
    for (let name in states) {
      points.push({
        measurement: name,
        tags: {agentId: agentId, deviceId: thingId},
        fields: {value: states[name]},
        time: timestamp
      })
    }
    this.influx.writePoints(points).then(() => {
    })
  }

  fetch (agentId, thingId, measurement, number) {
    if (!number) {
      number = 1
    }
  }
}

module.exports = I1820Log
