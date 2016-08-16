'use strict';

/**
 * Module dependencies
 */
var crimes = require('../controllers/crimes.server.controller');

module.exports = function(app) {
  app.route('/api/crimes/types').get(crimes.crimeTypes);
  app.route('/api/crimes').get(crimes.list);
  app.route('/api/crimes/types/top/:box').get(crimes.getTop);
};
