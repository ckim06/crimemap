(function () {
  'use strict';
  angular
    .module('crimes', ['uiGmapgoogle-maps'])
    .controller('CrimesListController', CrimesListController);

  CrimesListController.$inject = ['CrimesService'];

  function CrimesListController(CrimesService) {
    var vm = this;
    vm.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    vm.crimes = CrimesService.query();
  }
}());
