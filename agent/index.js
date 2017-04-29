'use strict';

const winston = require('winston');

module.exports = function agent(options) {
  /**
   * Fetch the list of all the agents.
   */
  this.add({role: 'agent', action: 'fetch'}, function (args, respond) {
    let agents = this.make('I1820', 'agent');
    winston.info('I1820.agent fetch:');
    agents.list$({}, respond);
  });

  /**
   * Fetch an agent by id.
   */
  this.add({role: 'agent', action: 'fetch', criteria: "byUUID"}, function (args, respond) {
    let agents = this.make('I1820', 'agent');
    winston.info('I1820.agent fetch byUUID:');
    agents.list$({uuid: args.uuid}, respond);
  });

  /**
   * Ping from agnet.
   */
  this.add({role: 'agent', action: 'ping'}, function (msg, respond) {
    let agents = this.make('I1820', 'agent');
    winston.info('I1820.agent ping:');

    agents.list$({uuid: msg.data.id}, function (err, list) {
      if (list.length === 0) {

        agents.uuid = msg.data.id;
        agents.things = msg.data.things;
        agents.timestamp = Date.now();

        winston.info(agents.data$(false));

        agents.save$(function (err, agent) {
          respond(err, agent.data$(false));
        });
      } else if (list.length === 1) {

        let agent = list[0];
        agent.timestamp = Date.now();

        winston.info(agent.data$(false));

        agents.save$(function (err, agent) {
          respond(err, agent.data$(false));
        });
      } else {
        respond(new Error(`Duplicate agent: ${msg.data.id}`), null);
      }
    });
  });
};
