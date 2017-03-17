(function() {
  'use strict';

  angular
    .module('kd.core')
    .service('Bundle', BundleUtils);

  /* @ngInject */
  function BundleUtils($window) {
    return {
      apiLocation: $window.bundle.apiLocation,
      contextPath: $window.bundle.contextPath,
      kappLocation: $window.bundle.kappLocation,
      kappSlug: $window.bundle.kappSlug,
      location: $window.bundle.location,
      spaceLocation: $window.bundle.spaceLocation,
      spaceSlug: $window.bundle.spaceSlug
    };
  }
})();
