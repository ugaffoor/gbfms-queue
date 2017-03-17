(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDiscussionController', QueueDiscussionController);

  /* @ngInject */
  function QueueDiscussionController(item, queueDiscussionServer, Toast, $http, $scope) {
    var queue = $scope.queue;
    var vm = this;
    vm.item = item;
    vm.discussionServer = queueDiscussionServer;

    activate();

    function activate() {
    }
  }
})();
