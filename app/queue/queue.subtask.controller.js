(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSubtaskController', QueueSubtaskController);

  /* @ngInject */
  function QueueSubtaskController(item, currentKapp, subtask, Bundle, Form, Submission, Toast, $window, $scope, $state, $timeout, $document, $compile) {
    var details = $scope.details;
    var vm = this;

    // MEMBERS
    vm.item = item;
    vm.subtask = subtask;
    vm.subtasks = [];
    vm.selectedSubtask = null;

    // METHODS
    vm.selectSubtask = selectSubtask;

    // Initialize.
    activate();

    function activate() {
      if(!details.isMine()) {
        return;
      }

      var itemPath = Bundle.kappLocation() + '/' + subtask.slug;
      if(!_.isEmpty(vm.item.values['Assigned Team'])) {
        itemPath += '?values[Assigned%20Team]='+encodeURIComponent(vm.item.values['Assigned Team']);
      }

      K.reset();
      K.load({
        container: '#workContainer',
        parentId: vm.item.id,
        originId: (vm.item.origin !== null ? vm.item.origin.id : vm.item.id),
        path: itemPath,
        loaded: function() {
          $timeout(function() {
            // We need to compile the loaded form.
            var element = angular.element($document[0].querySelector('#workContainer'));
            $compile(element)($scope);
            vm.isLoading = false;
          });
        },
        completed: function() {
          $timeout(function() {
            Toast.success('Completed item!');
            $state.go('queue.by.details.summary', {}, {reload:true});
          }, 3000);
        },
        created: updateParent,
        updated: updateParent
      });

      function updateParent() {
        Toast.success('Added subtask.');
        $state.go('queue.by.details.summary', {}, {reload:true});
      }
    }

    function selectSubtask(subtask) {
      vm.selectedSubtask = subtask;
      var itemPath = Bundle.kappLocation() + '/' + subtask.slug;

      K.reset();
      K.load({
        container: '#workContainer',
        parentId: vm.item.id,
        originId: (vm.item.origin !== null ? vm.item.origin.id : vm.item.id),
        path: itemPath,
        loaded: function() {
          $timeout(function() {
            vm.isLoading = false;
          });
        },
        completed: function() {
          $timeout(function() {
            Toast.success('Completed item!');
            $state.go('queue.by.details.summary', {}, {reload:true});
          }, 3000);
        },
        created: updateParent,
        updated: updateParent
      });

      function updateParent() {
        Toast.success('Added subtask.');
        $state.go('queue.by.details.summary', {}, {reload:true});
      }
    }
  }
}());
