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
  constructor(options) {
    super();
    this.mqttClient  = mqtt.connect(`mqtt://${options.host}:${options.port}`);

    this.mqttClient.on('connect',() => {
      winston.info(` * MQTT at ${options.host}:${options.port}`);
      this.mqttClient.subscribe(`I1820/${options.cluster}/agent/ping`);
      this.mqttClient.subscribe(`I1820/${options.cluster}/log/send`);
    });

    this.mqttClient.on('error', (err) => {
      winston.error(err);
    });

    this.mqttClient.on('message', (topic, message) => {
      const splitedTopic = topic.split('/');

      if (splitedTopic[2] === 'log') {
        if (splitedTopic[3] === 'send') {
          this.onLog(JSON.parse(message));
        }
      } else if (splitedTopic[2] === 'agent') {
        if (splitedTopic[3] === 'ping') {
          this.onPing(JSON.parse(message));
        }
      }

    });

  }
}

module.exports = I1820MqttConnectivity;
