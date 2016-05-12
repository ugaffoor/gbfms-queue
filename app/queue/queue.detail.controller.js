(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDetailController', QueueDetailController);

  /* @ngInject */
  function QueueDetailController(helperKapp, item, AssignmentService, Toast, $state, $scope) {
    var vm = this;
    vm.isMine = isMine;
    vm.grabIt = grabIt;
    vm.getAssignedIndividual = getAssignedIndividual;

    var layout = $scope.layout;

    function isMine() {
      return layout.currentUser.username === getAssignedIndividual(item);
    }

    function grabIt() {
      AssignmentService.grabIt(helperKapp, layout.currentUser.username, item.values['Assigned Group'], item).then(
        function() {
          Toast.success('Grabbed item.');
          $state.go('.', {}, {reload:true});
        },
        function(error) {
          // Display the error information to the user.
          Toast.error(error);
          // And then change to the assignment tab.
          $state.go('queue.by.details.assignment', {}, {reload:true});
        }
      );
    }

    function getAssignedIndividual() {
      return item.values['Assigned Individual'];
    }
  }
}());
