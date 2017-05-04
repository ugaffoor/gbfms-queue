(function() {
  'use strict';

  angular.module('kd.bundle.angular').config(routes);

  /* @ngInject */
  function routes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/queue/filter/__default__');
  }
})();
