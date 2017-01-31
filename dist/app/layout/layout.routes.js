(function() {
  'use strict';

  routes.$inject = ["$stateProvider"];
  angular
    .module('kd.bundle.angular.layout')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('base', {
      abstract: true,

      // Only resolve items which can be accessed anonymously.
      resolve: {
        kappSlug: ["Bundle", function(Bundle) {
          return Bundle.kappSlug();
        }],
        kappName: ["Bundle", function(Bundle) {
          return Bundle.kappSlug();
        }]
      },

      views: {
        '': {
          template: '<div data-comment="base state view" data-ui-view=""></div>'
        }
      }
    });

    // Provides the public layout and controller.
    $stateProvider.state('public', {
      parent: 'base',
      abstract: true,

      views: {
        '': {
          controller: 'LayoutPublicController as layout',
          templateUrl: 'layout/layout.public.tpl.html'
        }
      }
    });

    $stateProvider.state('protected', {
      parent: 'base',
      abstract: true,

      resolve: {
        kapps: ["KappModel", function(KappModel) {
          return KappModel.build().getList({include:'details,attributes'});
        }],
        currentSpace: ["SpaceModel", function(SpaceModel) {
          return SpaceModel.current().get({include:'attributes'});
        }],
        currentKapp: ["KappModel", "kappSlug", function(KappModel, kappSlug) {
          return KappModel.build().one(kappSlug).get({include:'details,attributes'});
        }],
        currentUser: ["$http", "$q", "Bundle", function($http, $q, Bundle) {
          return $http.get(Bundle.apiLocation() + '/me?include=attributes,profileAttributes,memberships,memberships.team').then(
            function(response) {
              return response.data;
            }
          );
        }],

        // These helpers are used by the "setup" in the kapp feature.
        spaceConfigResolver: ["currentUser", "currentSpace", "$state", function(currentUser, currentSpace, $state) {
          return function(attributeKey, shouldFail) {
            if(typeof shouldFail !== 'boolean') {
              shouldFail = true;
            }

            var attribute = _.find(currentSpace.attributes, {name:attributeKey});
            if(shouldFail && _.isEmpty(attribute)) {
              if(currentUser.spaceAdmin) {
                $state.go('setup');
              } else {
                $state.go('error.setup');
              }
            } else {
              return attribute;
            }
          };
        }],
        kappConfigResolver: ["currentUser", "currentKapp", "$state", function(currentUser, currentKapp, $state) {
          return function(attributeKey, shouldFail) {
            if(typeof shouldFail !== 'boolean') {
              shouldFail = true;
            }

            var attribute = _.find(currentKapp.attributes, {name:attributeKey});
            if(shouldFail && (_.isEmpty(attribute) || _.isEmpty(attribute.values))) {
              if(currentUser.spaceAdmin) {
                console.log('Missing attribute: ' + attributeKey)
                $state.go('setup');
              } else {
                $state.go('error.setup');
              }
            } else {
              return attribute;
            }
          };
        }]
      },

      views: {
        '': {
          templateUrl: 'layout/layout.protected.tpl.html',
          controller: 'LayoutController as layout'
        }
      }
    });
  }
})();
