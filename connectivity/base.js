/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 04-06-2017
 * |
 * | File Name:     base.js
 * +===============================================
 */
const EventEmitter = require('events').EventEmitter;


class I1820Connectivity extends EventEmitter {

  onLog(msg) {
    this.emit('log', msg);
  }

  onPing(msg) {
    this.emit('ping', msg);
  }

  onConfiguration(msg) {
    this.emit('configuration', msg);
  }

  onTrap(msg) {
    this.emit('trap', msg);
  }
}

module.exports = I1820Connectivity;
