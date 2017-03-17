(function() {
  'use strict';

  UserModel.$inject = ["CoreNameAPI", "Bundle", "$log", "$http"];
  angular
    .module('kd.core.models')
    .factory('UserModel', UserModel);

  /* @ngInject */
  function UserModel(CoreNameAPI, Bundle, $log, $http) {
    $log.info('{Model} Defining "User" model.');

    return {
      currentUser: fetchCurrentUser
    };

    function fetchCurrentUser() {
      return $http.get(Bundle.apiLocation() + '/me').then(
        function success(response) {
          return response.data;
        }
      );
    }
  }
})();
