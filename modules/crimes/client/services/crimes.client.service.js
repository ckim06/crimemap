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
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: function(data, headers) {
          var markers = angular.fromJson(data);
          markers.forEach(function(marker) {
            marker.icon = '/modules/crimes/client/img/dot.png';
          });
          return markers;
        }
      },
      types: {
        method: 'GET',
        url: 'api/crimes/types',
        isArray: true
      },
      topTypes: {
        method: 'GET',
        params: {
          box: '@box'
        },
        url: 'api/crimes/types/top/:box',
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
