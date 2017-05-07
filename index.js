'use strict';
/* Seneca application */
const app = require('seneca')();
const entities = require('seneca-entity');
const webapp = require('seneca-web');
const webapp_config = require('./http');

/* consul client */
const config = require('config');
const consul = require('consul')({
  host: config.get('cluster.consul.host')
});

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
app.use('connectivity');
app.use(webapp, webapp_config);

/**
 * Seneca is ready
 */
app.ready(() => {
  let server = app.export('web/context')();
  server.start(() => {
    console.log(` * HTTP at ${server.info.uri}`);
  });
});
