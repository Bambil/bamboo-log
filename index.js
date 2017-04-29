'use strict';

const app = require('seneca')();
const mqtt = require('mqtt');
const config = require('config');
const entities = require('seneca-entity');

/**
 * I1820 Initiation
 */
console.log(' * 18.20 at Sep 07 2016 7:20 IR721');

/**
 * Initiates seneca modules
 */
app.use(entities);
app.use('discovery');
app.use('log');

/**
 * Creates MQTT connection
 */
const mqttClient  = mqtt.connect(`mqtt://${config.get('mqtt.ip')}`);

mqttClient.on('connect', function () {
  console.log(`* MQTT at ${config.get('mqtt.ip')}`);
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/discovery/ping`);
  mqttClient.subscribe(`I1820/${config.get('cluster.name')}/log/send`);
});

mqttClient.on('error', function () {
});

mqttClient.on('message', function (topic, message) {
  let splitedTopic = topic.split('/');
  app.act({role: splitedTopic[2], action: splitedTopic[3], data: JSON.parse(message)},
          function (err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log(data);
            }
          });
});
