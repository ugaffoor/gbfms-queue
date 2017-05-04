(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDiscussionController', QueueDiscussionController);

  /* @ngInject */
  function QueueDiscussionController(item, queueDiscussionServer, Bundle, Toast, $http, $scope) {
    var queue = $scope.queue;
    var vm = this;
    vm.item = item;
    vm.discussionServer = queueDiscussionServer;
    vm.embedBase = Bundle.spaceLocation();

    activate();

    function activate() {
    }
  }
})();
