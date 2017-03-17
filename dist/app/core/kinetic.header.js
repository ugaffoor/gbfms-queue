(function() {
  'use strict';

  KineticHeaderController.$inject = ["SpaceModel", "KappModel", "Bundle", "UserModel"];
  angular
    .module('kd.core')
    .controller('KineticHeaderController', KineticHeaderController)
    .component('kineticHeader', kineticHeaderComponent());

  function kineticHeaderComponent() {
    return {
      bindings: {
        kappSlug: '@',
        kapp: '<',
        adminLinks: '<'
      },
      controller: 'KineticHeaderController',
      controllerAs: 'header',
      templateUrl: 'core/kinetic.header.html'
    };
  }

  /* @ngInject */
  function KineticHeaderController(SpaceModel, KappModel, Bundle, UserModel) {
    var header = this;

    // MEMBERS

    // METHODS
    header.kappIcon = kappIcon;
    header.kappUrl = kappUrl;
    header.managementUrl = managementUrl;
    header.isSpaceAdmin = isSpaceAdmin;

    activate();

    function activate() {
      // If a Kapp object was not provided to us.
      if(typeof header.kapp !== 'object') {
        // If a Kapp  slug was not provided
        if(typeof header.kappSlug !== 'string' || header.kappSlug.length < 1) {
          header.kapp = {
            name: 'Invalid Kapp',
            slug: 'invalid-kapp'
          };
        } else {
          // Look up the Kapp.
          fetchCurrentKapp();
        }
      }

      fetchAllKapps();
      fetchCurrentUser();
    }

    function fetchCurrentUser() {
      UserModel.currentUser().then(
        function success(currentUser) {
          header.currentUser = currentUser;
        },
        function failure(error) {
          alert('OH GNO');
        }
      );
    }

    function fetchCurrentKapp() {
      KappModel.build().one(header.kappSlug).get({include:'details,attributes'}).then(
        function success(kapp) {
          header.kapp = kapp;
        },
        function failure() {
          alert('OH GNO');
        }
      );
    }

    function fetchAllKapps() {
      KappModel.build().getList({include:'details,attributes'}).then(
        function success(kapps) {
          header.kapps = kapps;
        },
        function failure() {
          alert('OH GNO');
        }
      );
    }

    function isSpaceAdmin() {
      return true;
    }

    function kappIcon(kapp) {
      var iconAttribute = _.find(kapp.attributes, {name: 'Icon'});
      return (iconAttribute ? iconAttribute.values[0] : 'fa-cloud');
    }

    function kappUrl(kapp) {
      return Bundle.spaceLocation() + '/' + kapp.slug;
    }

    function managementUrl() {
      return Bundle.spaceLocation() + '/app/';
    }
  }

})();
