(function() {
  'use strict';

  routes.$inject = ["$stateProvider"];
  angular
    .module('kd.bundle.angular.layout')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('default', {
      parent: 'app',
      abstract: true,

      resolve: {
        kappSlug: ["ConfigStore", function(ConfigStore) {
          return ConfigStore.get('kappSlug');
        }],
        kapps: ["KappModel", function(KappModel) {
          return KappModel.build().getList({include:'details,attributes'});
        }],
        currentUser: ["$http", "$q", "ConfigStore", function($http, $q, ConfigStore) {
          var deferred = $q.defer();

          $http.get(ConfigStore.get('apiBaseUrl') + '/me').then(
            function(response) {
              deferred.resolve(response.data);
            },
            function(error) {
              deferred.reject(error);
            }
          );

          return deferred.promise;
        }]
      },

      views: {
        '': {
          templateUrl: 'layout/layout.default.tpl.html',
          controller: 'LayoutController as layout',
          resolve: {
            currentKapp: ["KappModel", "kappSlug", function(KappModel, kappSlug) {
              return KappModel.build().one(kappSlug).get();
            }]
          }
        }
      }
    });
  }
})();