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

  CrimesListController.$inject = ['CrimesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$timeout'];

  function CrimesListController(CrimesService, uiGmapGoogleMapApi, uiGmapIsReady, $timeout) {
    var vm = this;
    vm.map = {
      center: {
        latitude: 34.0446,
        longitude: -118.2450
      },
      zoom: 13,
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
      vm.mapInstance.addListener('idle', vm.onDragEnd);

    });

    vm.markers = CrimesService.query();
    vm.crimeTypes = CrimesService.types();

    vm.onDragEnd = function() {
      var bounds = vm.mapInstance.getBounds();

      vm.markers = CrimesService.query({
        box: {
          $box: [
            [bounds.j.H, bounds.H.j],
            [bounds.j.j, bounds.H.H]
          ]
        }
      });
    };

    vm.selectCrimeType = function() {
      vm.markers = CrimesService.query({
        crm_cd_desc: vm.crimeTypeOption
      });
    };
  }
}());
