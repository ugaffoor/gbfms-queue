(function() {
  'use strict'
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueNewItemModalController', QueueNewItemModalController);

  /* @ngInject */
  function QueueNewItemModalController(activeTeam, formsForTeam, currentUser, Bundle, Toast, $window, $timeout, $state, $uibModalInstance, $compile, $scope, $document) {
    var vm = this;

    vm.activeTeam = activeTeam;
    vm.filteredForms = formsForTeam;
    vm.formLoaded = false;
    vm.loadedForm = null;

    vm.close = function() {
      if(vm.loadedForm !== null) {
        vm.loadedForm.close();
      }
      $uibModalInstance.dismiss();
    }

    vm.loadForm = function(form) {
      var formPath = Bundle.kappLocation() + '/' + form.slug + '?values[Assigned%20Team]='+encodeURIComponent(vm.activeTeam);
      var K = $window.K;

      K.load({
        container: '#formContainer',
        path: formPath,
        loaded: function(form) {
          console.log(form);
          vm.loadedForm = form;

          var footerSection = angular.element(form.find('section[data-element-name=Footer]')[0]);
          footerSection.detach();

          var modalFooter = angular.element(document.querySelector('.modal-footer'));
          modalFooter.empty();
          modalFooter.append(footerSection);

          // We need to compile the loaded form.
          var element = angular.element($document[0].querySelector('#formContainer'));
          $compile(element)($scope);

          $timeout(function() { vm.formLoaded = true; });
        },
        updated: function(data, actions) {
          var itemId = data.submission.id;
          var assignedIndividual = data.submission.values['Assigned Individual'];

          $timeout(function() {
            Toast.success('Started new work item.');
            if(assignedIndividual === currentUser.username) {
              $state.go('queue.by.details.summary.work', {itemId: itemId, filterName: vm.activeTeam, filterType: 'Open'});
            } else {
              $state.go('queue.by.details.summary', {itemId: itemId, filterName: vm.activeTeam, filterType: 'Open'});
            }
            actions.close();
            $uibModalInstance.dismiss();
          }, 1000);
        }
      });
    }
  }

})();
