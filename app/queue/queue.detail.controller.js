(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueDetailController', QueueDetailController);

  /* @ngInject */
  function QueueDetailController(item, AssignmentService, Toast, $state, $scope) {
    var list = $scope.list;
    var layout = $scope.layout;
    var vm = this;

    vm.item = item;

    vm.isOpen = isOpen;
    vm.isMine = isMine;
    vm.canHaveSubtasks = canHaveSubtasks;
    vm.grabIt = grabIt;
    vm.getAssignedIndividual = getAssignedIndividual;


    activate();

    function activate() {
      list.hideList();
      list.activeItem = item.id;
    }

    function isOpen() {
      return item.coreState !== 'Closed' && item.coreState !== 'Submitted';
    }

    function isMine() {
      return layout.currentUser.username === getAssignedIndividual(item);
    }

    function canHaveSubtasks() {
      var attribute = _.find(item.form.attributes, { name: 'Prohibit Subtasks' });
      if(!_.isEmpty(attribute) && (
        'TRUE' === attribute.values[0].toUpperCase() ||
        'YES' === attribute.values[0].toUpperCase())) {
        return false;
      } else {
        return true;
      }
    }

    function grabIt() {
      AssignmentService.grabIt(layout.currentUser.username, item.values['Assigned Group'], item).then(
        function() {
          Toast.success('Grabbed item.');
          $state.go('.', {}, {reload:true});
        },
        function(error) {
          // Display the error information to the user.
          Toast.error(error);
        }
      );
    }

    function getAssignedIndividual() {
      return item.values['Assigned Individual'];
    }
  }
}());
