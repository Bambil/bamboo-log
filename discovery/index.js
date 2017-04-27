'use strict';

var Agent = require('../models/agent');

module.exports = function discovery(options) {
  /**
   * Fetch the list of all the agents.
   */
  this.add({role: 'discovery', action: 'fetch'}, function (msg, respond) {
    var agents = this.make('agents');
  });

  /**
   * Ping from agnet.
   */
  this.add({role: 'discovery', action: 'ping'}, function (msg, respond) {
    var newAgent = new Agent(msg.data.id);
    console.log(newAgent);
    var agents = this.make("agents");
  });
};
