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
    contactPoints: [options.host]
  })
  client.connect(() => {
    client.execute(`CREATE KEYSPACE IF NOT EXISTS ${options.database} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' }`, (err) => {
      if (err) {
        logger.log('error', err)
        return
      }
      client.execute(`USE ${options.database}`)
    })
  })

  return {
    log: function (agentId, thingId, timestamp, states) {
      let r = []
      for (let name in states) {
        client.execute(`CREATE TABLE IF NOT EXISTS ${name} (
            agentId text,
            deviceId text,
            time timestamp,
            value int,
            PRIMARY KEY (agentId, deviceId)
          )`).then(() => {
            const query = `INSERT INTO ${name} (agentId, deviceId, time, value) VALUES (?,?,?,?)`
            r.push(client.execute(query, [agentId, thingId, timestamp, states[name]], {prepare: true}))
          })
      }
      return Promise.all(r)
    },
    fetch: function (agentId, thingId, measurement, number) {
      return new Promise((resolve, reject) => {
        client.execute(`SELECT * FROM ${measurement}
                  WHERE "agentId" = '${agentId}' AND "deviceId" = '${thingId}'
                  ORDER BY time DESC LIMIT ${number};`,
          (err, result) => {
            if (err) {
              console.log(err)
              reject(err)
              return
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
