(function() {
  'use strict';

  LayoutController.$inject = ["currentKapp", "currentSpace", "currentUser", "kapps", "$state", "$window"];
  angular
    .module('kd.bundle.angular.layout')
    .controller('LayoutController', LayoutController);

  /* @ngInject */
  function LayoutController(currentKapp, currentSpace, currentUser, kapps, $state, $window) {
    var layout = this;
    layout.kapp = currentKapp;
    layout.kapps = kapps;
    layout.currentUser = currentUser;
    layout.currentSpace = currentSpace;
    layout.kappIcon = kappIcon;
    layout.isSpaceAdmin = isSpaceAdmin;
    layout.isSetupVisible = isSetupVisible;
    layout.isParentActive = isParentActive;
    layout.kappUrl = kappUrl;
    layout.managementUrl = managementUrl;

    function isSetupVisible() {
      var visibleAttribute = _.find(currentKapp.attributes, {name: 'Queue Setup Visible'});
      var isVisible = (visibleAttribute ? visibleAttribute.values[0] : 'true');
      return isVisible === 'true';
    }

    function isSpaceAdmin() {
      return layout.currentUser.spaceAdmin;
    }

    function isParentActive(parentState) {
      return _.startsWith($state.$current.name, parentState);
    }

    function kappIcon(kapp) {
      var iconAttribute = _.find(kapp.attributes, {name: 'Icon'});
      return (iconAttribute ? iconAttribute.values[0] : 'fa-cloud');
    }

    function kappUrl(kapp) {
      return $window.KD.base + '/' + kapp.slug;
    }

    function managementUrl() {
      return $window.KD.base + '/app/';
    }
  }
})();
