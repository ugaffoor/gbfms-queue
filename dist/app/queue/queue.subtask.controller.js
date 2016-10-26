(function() {
  'use strict';

  QueueSubtaskController.$inject = ["item", "currentKapp", "Bundle", "Form", "Submission", "Toast", "$window", "$state", "$timeout"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSubtaskController', QueueSubtaskController);

  /* @ngInject */
  function QueueSubtaskController(item, currentKapp, Bundle, Form, Submission, Toast, $window, $state, $timeout) {
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
      var itemPath = Bundle.kappLocation() + '/' + subtask.slug;

      K.reset();
      K.load({
        container: '#workContainer',
        parentId: vm.item.id,
        originId: vm.item.origin.id || vm.item.id,
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
        updated: updateParent /*function() {
          console.log('updated', arguments);
          $timeout(function() {
            Toast.success('Updated item.');
            $state.go('.', {}, {reload:true});
          });
        }*/
      });

      function updateParent(response) {
        console.log('updating parent')
        var submission = response.submission;
        var subtasks = vm.item.values['Subtasks'];

        // Check to see if this submission is already in the array.
        //if(!_.some(subtasks, {"id": submission.id})) {
        //  subtasks.push({id: submission.id});
        //  vm.item.values['Subtasks'] = JSON.stringify(subtasks);

        //  Submission.save(vm.item).then(
        //    function success() {
              Toast.success('Added subtask.');
              $state.go('queue.by.details.summary', {}, {reload:true});
        //    });
        //}
      }
    }
  }
}());
