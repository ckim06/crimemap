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
    vm.showWindow = false;
    vm.mapInstance = {};
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        vm.mapInstance = inst.map;
      });

      vm.map.events = {
        click: function(marker, eventName, model) {
          vm.windowParams = {
            markedModel: model
          };
          vm.showWindow = true;
        }
      };
      vm.mapInstance.addListener('idle', vm.onIdle);

    });

    vm.markers = CrimesService.query();
    vm.crimeTypes = CrimesService.types();

    vm.onIdle = function() {
      var bounds = vm.mapInstance.getBounds();
      var boundsBox = JSON.stringify([
        [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
        [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()]
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
        crm_cd: vm.crimeTypeOption
      });
    };
  }
}());
