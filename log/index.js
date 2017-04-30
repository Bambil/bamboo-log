'use strict';

const config = require('config');
const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: config.get('influx.host'),
  database: config.get('influx.database')
});

console.log(` * influx at ${config.get('influx.host')}`);

module.exports = function log(options) {
  this.add({role: 'log', action: 'send'}, function (msg, respond) {
    let points = [];
    msg.data.states.forEach(function (state) {
      points.push({
        measurement: state.name,
        tags: {agent_id: msg.data.agent, device_id: msg.data.device},
        fields: {value: state.value}
      });
    });
    influx.writePoints(points).then(respond);
  });
};
