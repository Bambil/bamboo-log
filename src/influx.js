/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 01-09-2017
 * |
 * | File Name:     src/influx.js
 * +===============================================
 */
const Influx = require('influx')
const logger = require('./logger')

module.exports = function (options) {
  const influx = new Influx.InfluxDB({
    host: options.host,
    database: options.database
  })

  influx.createDatabase(options.database).then(() => {
  }).catch((err) => {
    logger.log('error', err)
  })

  return {
    log: function (agentId, thingId, timestamp, states) {
      const points = []
      for (let name in states) {
        points.push({
          measurement: name,
          tags: {agentId: agentId, deviceId: thingId},
          fields: {value: states[name]},
          time: timestamp
        })
      }
      return influx.writePoints(points)
    },
    fetch: function (agentId, thingId, measurement, number) {
      return new Promise((resolve, reject) => {
        influx.query(`SELECT * FROM ${measurement}
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
}
