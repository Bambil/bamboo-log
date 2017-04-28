'use strict';

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
    var agents = this.make("agent");
    agents.load$(msg.data.id, function (err, agent) {
      if (agent === null) {
        agents.id = msg.data.id;
        agents.things = msg.data.things;
        agents.timestamp = Date.now();
        agents.save$(respond);
      } else {
        agent.timestamp = Date.now();
        agent.save$(respond);
      }
    });
  });
};
