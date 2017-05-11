'use strict';

const hapi = require('hapi');

module.exports = {
  routes: require('./routes'),
  adapter: require('seneca-web-adapter-hapi'),
  context: (() => {
    const server = new hapi.Server();
    server.connection({port: 8080});
    return server;
  })()
};
