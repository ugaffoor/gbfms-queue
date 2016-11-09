(function() {
  'use strict';

  QueueSubtaskController.$inject = ["item", "currentKapp", "subtask", "Bundle", "Form", "Submission", "Toast", "$window", "$state", "$timeout"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSubtaskController', QueueSubtaskController);

  /* @ngInject */
  function QueueSubtaskController(item, currentKapp, subtask, Bundle, Form, Submission, Toast, $window, $state, $timeout) {
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
      // Form.build(currentKapp.slug).getList().then(
      //   function success(forms) {
      //     vm.subtasks = _.filter(forms, function(form) {
      //       return form.type === 'Subservice' && form.status === 'Active';
      //     });
      //   });
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
