(function() {
  'use strict';

  QueueDiscussionController.$inject = ["item", "queueResponseServer"];
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
