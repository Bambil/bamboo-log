'use strict';

module.exports = function agent(options) {
  /**
   * Fetch the list of all the agents.
   */
  this.add({role: 'agent', action: 'fetch'}, function (msg, respond) {
    let agents = this.make('I1820', 'agent');
    agents.list$({}, respond);
  });

  /**
   * Ping from agnet.
   */
  this.add({role: 'agent', action: 'ping'}, function (msg, respond) {
    let agents = this.make('I1820', 'agent');
    agents.list$({uuid: msg.data.id}, function (err, list) {
      if (list.length === 0) {
        agents.uuid = msg.data.id;
        agents.things = msg.data.things;
        agents.timestamp = Date.now();
        agents.save$(respond);
      } else if (list.length === 1) {
        let agent = list[0];
        agent.timestamp = Date.now();
        agent.save$(respond);
      } else {
        respond(new Error(`Duplicate agent: ${msg.data.id}`), null);
      }
    });
  });
};
