(function() {
  'use strict';

  QueueWorkController.$inject = ["item", "$window", "$scope", "$state", "$timeout", "AssignmentService", "Bundle", "Toast"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueWorkController', QueueWorkController);

  /* @ngInject */
  function QueueWorkController(item, $window, $scope, $state, $timeout, AssignmentService, Bundle, Toast) {
    var vm = this;
    vm.item = item;
    vm.isLoading = true;

    vm.loading = function() {
      console.log('applying', vm.isLoading);
      return vm.isLoading;
    };

    var details = $scope.details;

    activate();

    function activate() {
      if(details.isMine()) {
        var itemPath = Bundle.spaceLocation() + '/submissions/' + item.id;

        if(item.coreState === 'Closed' || item.coreState === 'Submitted') {
          itemPath += '?review';
        }

        K.reset();
        K.load({
          container: '#workContainer',
          path: itemPath,
          loaded: function() {
            $timeout(function() {
              vm.isLoading = false;
              console.log('applied')
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

  }
}());
