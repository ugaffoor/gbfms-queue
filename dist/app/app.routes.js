(function() {
  'use strict';

  routes.$inject = ["$urlRouterProvider"];
  angular.module('kd.bundle.angular').config(routes);

  /* @ngInject */
  function routes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/queue/filter/__default__/Open');
  }
})();
