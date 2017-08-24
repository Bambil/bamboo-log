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
const logger = require('./logger')

class BambooLog {
  constructor (options) {
    this.influx = new Influx.InfluxDB({
      host: options.host,
      database: options.database
    })

    this.influx.createDatabase(options.database).then(() => {
    }).catch((err) => {
      logger.log('error', err)
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
    }).catch((err) => {
      logger.log('error', err)
    })
  }

  fetch (agentId, thingId, measurement, number) {
    if (!number) {
      number = 1
    }
    return new Promise((resolve, reject) => {
      this.influx.query(`SELECT * FROM ${measurement}
                  WHERE "agentId" = '${agentId}' AND "deviceId" = '${thingId}'
                  ORDER BY time DESC LIMIT ${number};`)
        .then((rows) => {
          let states = []
          for (let r of rows) {
            states.push({
              value: r.value,
              time: r.time
            })
          }
          resolve(states)
        }).catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = BambooLog
