(function () {
  'use strict';

  angular
    .module('crimes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crimes', {
        abstract: true,
        url: '/crimes',
        template: '<ui-view/>'
      })
      .state('crimes.list', {
        url: '',
        templateUrl: 'modules/crimes/client/views/list-crimes.client.view.html',
        controller: 'CrimesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crime Map'
        }
      });
  }
}());
