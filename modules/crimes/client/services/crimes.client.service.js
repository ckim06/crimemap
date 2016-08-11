(function() {
  'use strict';

  angular
    .module('crimes.services')
    .factory('CrimesService', CrimesService);

  CrimesService.$inject = ['$resource', '$http'];

  function CrimesService($resource, $http) {
    var Crime = $resource('api/crimes/:_id', {
      crimeId: '@_id',
      fields: '@fields',
      // limit: '@limit',
      offset: '@offset',
      filter: '@filter'
    }, {
      types: {
        method: 'GET',
        url: 'api/crimes/types',
        isArray: true
      }
    });
    return Crime;

    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());
