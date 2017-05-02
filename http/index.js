'use strict';

const routes = require('./routes.js');
const hapi = require('hapi');

const config = {
  routes: routes,
  adapter: require('seneca-web-adapter-hapi'),
  context: (() => {
    let server = new hapi.Server();
    server.connection({port: 4000});
    return server;
  })()
};
