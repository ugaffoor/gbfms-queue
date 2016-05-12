(function() {
  'use strict';

  config.$inject = ["ConfigStoreProvider", "$windowProvider"];
  angular.module('kd.bundle.angular').config(config);

  /* @ngInject */
  function config(ConfigStoreProvider, $windowProvider) {
    var $window = $windowProvider.$get();
    ConfigStoreProvider.set('apiBaseUrl', $window.KD.api);
    ConfigStoreProvider.set('loginPath', $window.KD.base + '/app/login.do');
    ConfigStoreProvider.set('kappSlug', $window.KD.kapp);
  }
})();
