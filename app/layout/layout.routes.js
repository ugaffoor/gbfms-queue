import angular from 'angular';
import layoutPublic from './layout.public.tpl.jade';
import layoutProtected from './layout.protected.tpl.jade';

angular
  .module('kd.bundle.angular.layout')
  .config(routes);

/* @ngInject */
function routes($stateProvider) {
  $stateProvider.state('base', {
    abstract: true,

    // Only resolve items which can be accessed anonymously.
    resolve: {
      kappSlug: function(Bundle) {
        return Bundle.kappSlug();
      },
      kappName: function(Bundle) {
        return Bundle.kappSlug();
      }
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
        templateUrl: layoutPublic
      }
    }
  });

  $stateProvider.state('protected', {
    parent: 'base',
    abstract: true,

    resolve: {
      kapps: function(KappModel) {
        return KappModel.build().getList({include:'details,attributes'});
      },
      currentSpace: function(SpaceModel) {
        return SpaceModel.current().get({include:'attributes'});
      },
      currentKapp: function(KappModel, kappSlug) {
        return KappModel.build().one(kappSlug).get({include:'details,attributes'});
      },
      currentUser: function($http, $q, Bundle) {
        return $http.get(Bundle.apiLocation() + '/me?include=attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes').then(
          function(response) {
            return response.data;
          }
        );
      },

      // These helpers are used by the "setup" in the kapp feature.
      spaceConfigResolver: function(currentUser, currentSpace, $state) {
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
      },
      kappConfigResolver: function(currentUser, currentKapp, $state) {
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
      }
    },

    views: {
      '': {
        templateUrl: layoutProtected,
        controller: 'LayoutController as layout'
      }
    }
  });
}
