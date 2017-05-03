module.exports = {
  routes: [{
    pin: {role: 'agent', action: '*'},
    prefix: '/v1/agent',
    map: {
      fetch: {
        GET: true
      }
    }
  }]
};
