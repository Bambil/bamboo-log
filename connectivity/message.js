/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 28-06-2017
 * |
 * | File Name:     message.js
 * +===============================================
 */

class Message {
  construcotr (agentId, thingId, component) {
    this.agentId = agentId
    this.thingId = thingId
    this.component = component
  }
}

module.exports = Message
