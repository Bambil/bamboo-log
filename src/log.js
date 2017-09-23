/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 27-06-2017
 * |
 * | File Name:     log.js
 * +===============================================
 */
const logger = require('./logger')

class BambooLog {
  constructor (db) {
    this.db = db
  }

  log (agentId, thingId, timestamp, states) {
    this.db.log(agentId, thingId, timestamp, states).then(() => {
    }).catch((err) => {
      logger.log('error', err)
    })
  }

  fetch (agentId, thingId, measurement, number) {
    if (!number) {
      number = 1
    }
    return this.db.fetch(agentId, thingId, measurement, number)
  }
}

module.exports = BambooLog
