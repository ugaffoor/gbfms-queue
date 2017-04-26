import angular from 'angular';

angular
  .module('kd.bundle.angular.queue')
  .controller('QueueNewItemController', QueueNewItemController);

/* @ngInject */
function QueueNewItemController(currentKapp, currentUser, formsByTeam, activeTeam, Toast, Bundle, $window, $timeout, $scope, $state) {
  var createList = $scope.createList;
  var vm = this;
  vm.activeTeam = activeTeam;
  vm.filteredForms = formsByTeam;
  vm.loadedForm = {};

  vm.loadForm = function(form) {
    var formPath = Bundle.kappLocation() + '/' + form.slug + '?values[Assigned%20Team]='+vm.activeTeam;
    var K = $window.K;

    createList.loadedForm = form;

    K.reset();
    K.load({
      container: '#formContainer',
      path: formPath,
      updated: function(data) {
        var itemId = data.submission.id;
        var assignedIndividual = data.submission.values['Assigned Individual'];

        $timeout(function() {
          K.reset();
          Toast.success('Started new work item.');
          if(assignedIndividual === currentUser.username) {
            $state.go('queue.by.details.summary.work', {itemId: itemId, filterName: vm.activeTeam});
          } else {
            $state.go('queue.by.details.summary', {itemId: itemId, filterName: vm.activeTeam});
          }
        }, 1000);
      }
    });

  };
}
