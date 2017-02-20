(function() {
  'use strict';

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
      if(!queue.hasDiscussion(vm.item)) {

        $http({
          url: queueResponseServer + '/api/v1/issues',
          method: 'POST',
          data: {
            name: vm.item.label,
            description: vm.item.label,
            tag_list: vm.item.id
          }
        }).then(
          function success(response) {
            vm.item.values['Response GUID'] = response.data.guid;
            var originalCoreState = vm.item.coreState;
            delete vm.item.currentPage;
            delete vm.item.coreState;

            // Save.
            vm.item.put().then(
              function success() {
                vm.item.coreState = originalCoreState;
                Toast.success('Started new discussion!');
              },
              function error() {
                Toast.error('Failed to update item with discussion.');
              }
            );
          },
          function error() {
            Toast.error('Failed to start Response Discussion. Contact your system administrator.');
          }
        );
      }
    }
  }
})();
