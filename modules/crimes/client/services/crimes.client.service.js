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
          var maxNumberOfCrimes = markers[0].count;
          var steps = Math.ceil(maxNumberOfCrimes / 5);
          markers.forEach(function(marker) {

            // figure out coloring scheme
            var number = Math.ceil(marker.count / steps);
            if (number === 1) {
              number = Math.ceil(marker.count / (steps / 5));
            } else {
              number = 5;
            }
            console.log(number);
            marker.icon = '/modules/crimes/client/img/' + number + '.png';

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
