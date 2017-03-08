(function() {
  'use strict';

  QueueDiscussionController.$inject = ["item", "queueResponseServer", "Toast", "$http", "$scope"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDiscussionController', QueueDiscussionController);

  /* @ngInject */
  function QueueDiscussionController(item, queueResponseServer, Toast, $http, $scope) {
    var queue = $scope.queue;
    var vm = this;
    vm.item = item;
    vm.responseServer = queueResponseServer;

    activate();

    function activate() {
    }
  }
})();
