'use strict';

const app = require('seneca')();
const mqtt = require('mqtt');
const config = require('config');
const entities = require('seneca-entity');
const winston = require('winston');

/**
 * Configure CLI output on the default logger
 */
winston.cli();

/**
 * I1820 Initiation
 */
console.log(' * 18.20 at Sep 07 2016 7:20 IR721');

/**
 * Initiates seneca modules
 */
app.use(entities);
app.use('agent');
app.use('log');

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

mqttClient.on('error', function () {
});

mqttClient.on('message', function (topic, message) {
  let splitedTopic = topic.split('/');
  app.act({role: splitedTopic[2], action: splitedTopic[3], data: JSON.parse(message)});
});
