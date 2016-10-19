(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSubtaskController', QueueSubtaskController);

  /* @ngInject */
  function QueueSubtaskController(item, currentKapp, Form, Toast, $window, $state, $timeout) {
    var vm = this;
    vm.item = item;
    vm.subtasks = [];
    vm.selectedSubtask = null;

    vm.selectSubtask = selectSubtask;

    activate();

    function activate() {
      Form.build(currentKapp.slug).getList().then(
        function success(forms) {
          vm.subtasks = _.filter(forms, function(form) {
            return form.type === 'Subservice' && form.status === 'Active';
          });
        });
    }

    function selectSubtask(subtask) {
      vm.selectedSubtask = subtask;

      var itemPath = $window.KD.base + '/' + currentKapp.slug + '/' +subtask.slug;

      K.reset();
      K.load({
        container: '#workContainer',
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
        updated: function() {
          $timeout(function() {
            Toast.success('Updated item.');
            $state.go('.', {}, {reload:true});
          });
        }
      });
    }
  }
}());
