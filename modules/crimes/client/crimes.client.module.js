(function (app) {
  'use strict';

  app.registerModule('crimes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('crimes.services');
  app.registerModule('crimes.routes', ['ui.router', 'core.routes', 'crimes.services']);
}(ApplicationConfiguration));
