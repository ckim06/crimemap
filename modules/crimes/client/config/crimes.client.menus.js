(function () {
  'use strict';

  angular
    .module('crimes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Crimes',
      state: 'crimes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crimes', {
      title: 'Crime Map',
      state: 'crimes.list',
      roles: ['*']
    });
  }
}());
