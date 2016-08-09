'use strict';

/**
 * Module dependencies
 */
var crimesPolicy = require('../policies/crimes.server.policy'),
  crimes = require('../controllers/crimes.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/crimes').all(crimesPolicy.isAllowed)
    .get(crimes.list);


};
