(function() {
  'use strict';
  angular.module('crimes').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.20', // defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
    });
  });
  angular
    .module('crimes', ['uiGmapgoogle-maps'])
    .controller('CrimesListController', CrimesListController);

  CrimesListController.$inject = ['CrimesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];

  function CrimesListController(CrimesService, uiGmapGoogleMapApi, uiGmapIsReady) {
    var vm = this;
    vm.map = {
      center: {
        latitude: 34.0446,
        longitude: -118.2450
      },
      zoom: 9,
      control: {}
    };
    vm.map.showWindow = true;
    vm.mapInstance = {};
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        vm.mapInstance = inst.map;
      });

      vm.map.events = {
        click: function(marker, eventName, model) {
          vm.markerModel = model;
          vm.markerModel.show = true;
        }
      };
      vm.mapInstance.addListener('idle', vm.onIdle);

    });

    vm.markers = CrimesService.query();
    vm.crimeTypes = CrimesService.types();

    vm.onIdle = function() {
      var bounds = vm.mapInstance.getBounds();
      var boundsBox = JSON.stringify([
        [bounds.j.H, bounds.H.j],
        [bounds.j.j, bounds.H.H]
      ]);
      vm.markers = CrimesService.query({
        'box': boundsBox
      });
      vm.getTopTypes(boundsBox);
    };
    vm.getTopTypes = function(box) {
      vm.topTypes = CrimesService.topTypes({
        'box': box
      });
    };

    vm.selectCrimeType = function() {
      vm.markers = CrimesService.query({
        crm_cd_desc: vm.crimeTypeOption
      });
    };
  }
}());
