(function() {
  'use strict';

  routes.$inject = ["$stateProvider"];
  angular
    .module('kd.bundle.angular.errors')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('error', {
      parent: 'app',
      abstract: true,
      url: '/error',
      templateUrl: 'errors/error.layout.tpl.html'
    });

    $stateProvider.state('error.setup', {
      url: '/setup',
      views: {
        '': {
          templateUrl: 'errors/error.setup.tpl.html'
        }
      }
    });

    $stateProvider.state('error.system', {
      url: '/system',
      views: {
        '': {
          templateUrl: 'errors/error.system.tpl.html'
        }
      }
    });
  }
})();
