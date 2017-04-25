'use strict';

var app = require('seneca')();
var mqtt = require('mqtt');
var config = require('config');

/**
 * Initiates discovery module
 */
app.use('discovery');

/**
 * Creates MQTT connection
 */
var client  = mqtt.connect(`mqtt://$(config.get('mqtt.ip'))`);

client.on('connect', function () {
  client.subscribe(`I1820/${config.get('cluster.name')}/discovery/ping`);
  // client.subscribe('I1820/' + config.get('cluster.name') + '/log');
});

client.on('message', function (topic, message) {
  let splitedTopic = topic.split('/');
  app.act({role: splitedTopic[2], action: splitedTopic[3], data: JSON.parse(message)},
          function (err, data) {
            if (err) {
              return;
            }
          }
         );
});
