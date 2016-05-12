(function() {
  'use strict';

  LayoutController.$inject = ["currentKapp", "kapps", "currentUser", "$state", "$window"];
  angular
    .module('kd.bundle.angular.layout')
    .controller('LayoutController', LayoutController);

  /* @ngInject */
  function LayoutController(currentKapp, kapps, currentUser, $state, $window) {
    var layout = this;
    layout.kapp = currentKapp;
    layout.kapps = kapps;
    layout.currentUser = currentUser;
    layout.kappIcon = kappIcon;
    layout.isSpaceAdmin = isSpaceAdmin;
    layout.isParentActive = isParentActive;
    layout.kappUrl = kappUrl;

    function isSpaceAdmin() {
      return layout.currentUser.spaceAdmin;
    }

    function isParentActive(parentState) {
      return _.startsWith($state.$current.name, parentState);
    }

    function kappIcon(kapp) {
      var iconAttribute = _.find(kapp.attributes, {name: 'Kapp Icon'});
      return (iconAttribute ? iconAttribute.values[0] : 'dashboard');
    }

    function kappUrl(kapp) {
      return $window.KD.base + '/' + kapp.slug;
    }
  }
})();
