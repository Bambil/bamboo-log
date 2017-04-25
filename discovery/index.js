'use strict';

module.exports = function (options) {
  /**
   * Fetch the list of all the products.
   */
  this.add({role: 'discovery', action: 'fetch'}, function (msg, respond) {
    var agents = this.make('agents');
  });

  this.add({role: 'discovery', action: 'ping'}, function (msg, respond) {
  });
};
