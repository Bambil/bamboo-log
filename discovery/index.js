'use strict';

module.exports = function (options) {
  this.add({role: 'discovery', cmd: 'ping'}, function (msg, respond) {
  });
};
