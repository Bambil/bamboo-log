/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 04-06-2017
 * |
 * | File Name:     mqtt.js
 * +===============================================
 */
const I1820Connectivity = require('./base');

const mqtt = require('mqtt');
const winston = require('winston');

class I1820MqttConnectivity extends I1820Connectivity {
  constructor(host, port, cluster) {
    super();
    this.mqttClient  = mqtt.connect(`mqtt://${host}:${port}`);

    this.mqttClient.on('connect',() => {
      winston.info(` * MQTT at ${host}:${port}`);
      this.mqttClient.subscribe(`I1820/${cluster}/agent/ping`);
      this.mqttClient.subscribe(`I1820/${cluster}/agent/fatch`);
      this.mqttClient.subscribe(`I1820/${cluster}/log/send`);
    });
  }
}

module.exports = I1820MqttConnectivity;
