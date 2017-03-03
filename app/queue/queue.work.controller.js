(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueWorkController', QueueWorkController);

  /* @ngInject */
  function QueueWorkController(item, $compile, $window, $document, $scope, $state, $timeout, AssignmentService, Bundle, Toast) {
    var vm = this;
    vm.item = item;
    vm.isLoading = true;

    vm.loading = function() {
      return vm.isLoading;
    };

    vm.isReviewing = function() {
      return item.coreState === 'Closed' || item.coreState === 'Submitted';
    };

    var details = $scope.details;

    activate();

    function activate() {
      var itemPath = Bundle.spaceLocation() + '/submissions/' + item.id;

      if(vm.isReviewing()) {
        itemPath += '?review';
      }

      K.reset();
      K.load({
        container: '#workContainer',
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
            $state.go('queue.by', {}, {reload:true});
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
