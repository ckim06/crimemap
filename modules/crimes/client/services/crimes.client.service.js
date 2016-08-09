(function () {
  'use strict';

  angular
    .module('crimes.services')
    .factory('CrimesService', CrimesService);

  CrimesService.$inject = ['$resource'];

  function CrimesService($resource) {
    var Crime = $resource('api/crimes/:_id', {
      articleId: '@_id'
    });

    return Crime;
    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());
