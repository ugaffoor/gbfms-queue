(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDiscussionController', QueueDiscussionController);

  /* @ngInject */
  function QueueDiscussionController(item, queueResponseServer) {
    var vm = this;
    vm.item = item;
    vm.responseServer = queueResponseServer;
  }
})();
