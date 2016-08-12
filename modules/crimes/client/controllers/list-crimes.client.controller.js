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

  CrimesListController.$inject = ['CrimesService', 'uiGmapGoogleMapApi'];

  function CrimesListController(CrimesService, uiGmapGoogleMapApi) {
    var vm = this;
    vm.map = {
      center: {
        latitude: 34.0446,
        longitude: -118.2450
      },
      zoom: 8
    };
    vm.showWindow = true;
    vm.markers = CrimesService.query(function(){
      vm.markers.forEach(function(marker){
        marker.icon = "/modules/crimes/client/img/dot.png";
      });
    });
    vm.crimeTypes = CrimesService.types();
    vm.mapEvents = {
      click: function(marker, eventName, model) {
        vm.markerModel = model;
        vm.markerModel.show = true;
      }
    };

    vm.selectCrimeType = function() {
      vm.markers = CrimesService.query({
        crm_cd_desc: vm.crimeTypeOption
      });
    };
  }
}());
