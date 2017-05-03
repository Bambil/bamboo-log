'use strict';

const routes = require('./routes');
const hapi = require('hapi');

module.exports = {
  routes: routes,
  adapter: require('seneca-web-adapter-hapi'),
  context: (() => {
    let server = new hapi.Server();
    server.connection({port: 8080});
    return server;
  })()
};
