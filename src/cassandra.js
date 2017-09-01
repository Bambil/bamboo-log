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
    },
    fetch: function (agentId, thingId, measurement, number) {
    }
  }
}
