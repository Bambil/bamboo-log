'use strict';

const config = require('config');
const Influx = require('influx');
const winston = require('winston');

const influx = new Influx.InfluxDB({
  host: config.get('influx.host'),
  database: config.get('influx.database')
});

influx.createDatabase(config.get('influx.database')).then(() => {
  winston.log(' * influx db created.');
});

winston.log(` * influx at ${config.get('influx.host')}`);

module.exports = function log() {
  this.add({role: 'log', action: 'send'}, (msg, respond) => {
    const points = [];
    msg.data.states.forEach((state) => {
      points.push({
        measurement: state.name,
        tags: {agentId: msg.data.agent, deviceId: msg.data.device},
        fields: {value: state.value}
      });
    });
    influx.writePoints(points).then(respond);
  });
};
