const routes = [{
  pin: {role: 'agent', action: '*'},
  prefix: '/agent/api/v1',
  map: {
    fetch: {
      GET: true
    }
  }
}];
