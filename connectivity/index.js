'use strict';

const mqtt = require('mqtt');
const config = require('config');

/**
 * Creates MQTT connection
 */
const mqttClient  = mqtt.connect(`mqtt://${config.get('mqtt.ip')}`);

mqttClient.on('connect', function () {
  console.log(` * MQTT at ${config.get('mqtt.ip')}`);
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/agent/ping`);
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/agent/fatch`);
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/log/send`);
});

module.exports = function connectivity(options) {
  mqttClient.on('error', () => {
  });

  mqttClient.on('message', (topic, message) => {
    let splitedTopic = topic.split('/');
    this.act({role: splitedTopic[2], action: splitedTopic[3], data: JSON.parse(message)});
  });
};
