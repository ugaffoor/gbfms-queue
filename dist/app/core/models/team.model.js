(function() {
  'use strict';

  TeamModel.$inject = ["CoreSlugAPI", "Bundle", "$log", "$http"];
  angular
    .module('kd.core.models')
    .factory('TeamModel', TeamModel);

  /* @ngInject */
  function TeamModel(CoreSlugAPI, Bundle, $log, $http) {
    $log.info('{Model} Defining "Team" model.');
    var factory = {
      build: build
    };
    return factory;

    function build() {
      return CoreSlugAPI
        .service('teams');
    }
  }
})();
