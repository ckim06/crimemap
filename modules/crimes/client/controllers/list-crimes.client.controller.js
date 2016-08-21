(function() {
  'use strict';
  angular
    .module('crimes', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        libraries: 'weather,geometry,visualization'
      });
    })
    // Order crimes by count.  Data comes back as object.
    .filter('orderObjectBy', function() {
      return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item, key) {
          item.key = key;
          filtered.push(item);
        });
        filtered.sort(function(a, b) {
          return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
      };
    })
    .controller('CrimesListController', CrimesListController);

  // Controller for crime list.
  CrimesListController.$inject = ['CrimesService', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];

  function CrimesListController(CrimesService, uiGmapGoogleMapApi, uiGmapIsReady) {
    var vm = this;

    // Inital map settings.
    vm.map = {
      center: {
        latitude: 34.0446,
        longitude: -118.2450
      },
      zoom: 14,
      control: {}
    };

    // Display info window
    vm.showWindow = false;
    vm.mapInstance = {};
    vm.markers = [];
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        vm.mapInstance = inst.map;
        var bounds = vm.mapInstance.getBounds();
        vm.boundsBox = JSON.stringify([
          [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
          [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()]
        ]);
        vm.markers = CrimesService.query({
          'box': vm.boundsBox
        });
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

    // Drop down for crime types.
    vm.crimeTypes = CrimesService.types();

    vm.onIdle = function() {
      var bounds = vm.mapInstance.getBounds();
      vm.boundsBox = JSON.stringify([
        [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
        [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()]
      ]);

      var query = {
        'box': vm.boundsBox
      };
      if (vm.crimeTypeOption) {
        query.crimeTypeOption = vm.crimeTypeOption;
      }
      vm.markers = CrimesService.query(query);
      vm.getTopTypes(vm.boundsBox);
      vm.crimeTypes = CrimesService.types({
        'box': vm.boundsBox
      });
    };
    vm.getTopTypes = function(box) {
      vm.topTypes = CrimesService.topTypes({
        'box': vm.boundsBox
      });
    };

    vm.selectCrimeType = function() {
      var query = {
        crimeTypeOption: vm.crimeTypeOption
      };
      if (vm.boundsBox) {
        query.box = vm.boundsBox;
      }
      vm.markers = CrimesService.query(query);
    };
  }
}());
