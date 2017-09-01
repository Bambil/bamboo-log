/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 01-09-2017
 * |
 * | File Name:     src/cassandra.js
 * +===============================================
 */
const cassandra = require('cassandra-driver')
const logger = require('./logger')

module.exports = function (options) {
  const client = new cassandra.Client({
    contactPoints: [options.host],
    keyspace: options.database
  })
  client.connect((err) => {
    if (err) {
      logger.log('error', err)
    }
  })

  return {
    log: function (agentId, thingId, timestamp, states) {
      for (let name in states) {
        const query = `INSERT INTO ${name} (agnet_id, thing_id, timestamp, value) VALUES (?,?,?,?)`
        client.execute(query, [agentId, thingId, timestamp, states[name]], {prepare: true}, (err) => {
          if (err) {
            logger.log('error', err)
          }
        })
      }
    },
    fetch: function (agentId, thingId, measurement, number) {
      return new Promise((resolve, reject) => {
        client.execute(`SELECT * FROM ${measurement}
                  WHERE "agentId" = '${agentId}' AND "deviceId" = '${thingId}'
                  ORDER BY time DESC LIMIT ${number};`,
          (err, result) => {
            if (err) {
              reject(err)
            }
            let rows = result.rows
            let states = []
            for (let r of rows) {
              states.push({
                value: r.value,
                time: r.time
              })
            }
            resolve(states)
          })
      })
    }
  }
}