(function() {
  'use strict';

  routes.$inject = ["$urlRouterProvider", "$stateProvider"];
  angular.module('kd.bundle.angular').config(routes);

  /* @ngInject */
  function routes($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/queue/filter/__default__');

    $stateProvider.state('app', {
      abstract: true,

      resolve: {
        kappSlug: ["ConfigStore", function(ConfigStore) {
          return ConfigStore.get('kappSlug');
        }],
        currentKapp: ["KappModel", "kappSlug", function(KappModel, kappSlug) {
          return KappModel.build().one(kappSlug).get({include:'details,attributes'});
        }]
      },

      views: {
        '': {
          template: '<div data-ui-view=""></div>',
        }
      }
    });

    $stateProvider.state('unauthenticated', {
      abstract: true,

      resolve: {
        kappSlug: ["ConfigStore", function(ConfigStore) {
          return ConfigStore.get('kappSlug');
        }],
        //currentKapp: function(KappModel, kappSlug) {
        //  return KappModel.build().one(kappSlug).get({include:'details,attributes'});
        //}
      },

      views: {
        '': {
          template: '<div data-ui-view=""></div>',
        }
      }
    });
  }
})();
