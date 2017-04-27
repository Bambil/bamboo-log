'use strict';

const app = require('seneca')();
const mqtt = require('mqtt');
const config = require('config');

/**
 * Initiates discovery module
 */
app.use('discovery');

/**
 * Creates MQTT connection
 */
const mqttClient  = mqtt.connect(`mqtt://${config.get('mqtt.ip')}`);

mqttClient.on('connect', function () {
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/discovery/ping`);
  // client.subscribe('I1820/' + config.get('cluster.name') + '/log');
});

mqttClient.on('message', function (topic, message) {
  let splitedTopic = topic.split('/');
  app.act({role: splitedTopic[2], action: splitedTopic[3], data: JSON.parse(message)},
          function (err, data) {
            if (err) {
              return;
            }
          }
         );
});
