import angular from 'angular';

angular
  .module('kd.bundle.angular.layout')
  .controller('LayoutController', LayoutController);

/* @ngInject */
function LayoutController(currentKapp, currentSpace, currentUser, kapps, Bundle, $state, $window) {
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
  layout.adminLinks = [
    {
      // The title to appear in the dropdown.
      title: 'Queue Setup',
      // The icon to appear to the left of the title.
      iconClass: 'fa-wrench',
      // Optional function to determine if it is visible to the user.
      visibility: function() {
        return true;
      },
      // The state to go to.
      sref: 'setup'
    }
  ];

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
    return Bundle.spaceLocation() + '/' + kapp.slug;
  }

  function managementUrl() {
    return Bundle.spaceLocation() + '/app/';
  }
}
