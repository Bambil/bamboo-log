/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 04-06-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */


module.exports = function connectivity(options) {
  const I1820Connectivity = require(`./${options.cc}`);
  const cc = new I1820Connectivity(options);

  cc.on('log', (msg) => {
    this.act({role: 'log', action: 'send',
      data: msg});
  });

  cc.on('ping', (msg) => {
    this.act({role: 'agent', action: 'ping',
      data: msg});
  });

};
