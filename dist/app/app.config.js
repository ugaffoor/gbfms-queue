(function() {
  'use strict';

  initialize.$inject = ["$rootScope", "$state", "$document"];
  config.$inject = ["ConfigStoreProvider", "$windowProvider"];
  angular.module('kd.bundle.angular').config(config).run(initialize);


  /* @ngInject */
  function initialize($rootScope, $state, $document) {
    $rootScope.$on('$stateChangeSuccess',function(event, toState) {
      var title = '';
      var globals = $state.$current.locals.globals;

      if(!_.isEmpty(globals.item) && !_.isEmpty(globals.item.label)) {
        title = globals.item.label + ' - ';
      }

      if(!_.isEmpty(globals.currentKapp) && !_.isEmpty(globals.currentKapp.name)) {
        title = title + globals.currentKapp.name;
      } else {
        title = title + 'Queue';
      }

      if(!_.isEmpty(globals.titleCompany)) {
        title = title + ' - ' + globals.titleCompany;
      }

      if(!_.isEmpty(globals.titleBrand)) {
        title = title + ' | ' + globals.titleBrand;
      }

      $document.find('title').text(title);
    });
  }

  /* @ngInject */
  function config(ConfigStoreProvider, $windowProvider) {
    var $window = $windowProvider.$get();
    //
    // We are going to load some essentials which are rendered into the kapp.jsp
    //
    //ConfigStoreProvider.set('apiBaseUrl', $window.KD.api);
    //ConfigStoreProvider.set('loginPath', $window.KD.base + '/app/login.do');
    //ConfigStoreProvider.set('kappSlug', $window.KD.kappSlug);
    //ConfigStoreProvider.set('kappName', $window.KD.kappName);
  }
})();
