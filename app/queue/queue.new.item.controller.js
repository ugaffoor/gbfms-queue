(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueNewItemController', QueueNewItemController);

  /* @ngInject */
  function QueueNewItemController(currentKapp, forms, Bundle, $window, $timeout) {
    var vm = this;
    vm.forms = forms;
    vm.loadedForm = {};

    vm.loadForm = function(form) {
      var formPath = Bundle.kappLocation() + '/' + form.slug;
      var K = $window.K;

      vm.loadedForm = form;

      K.reset();
      K.load({
        container: '#formContainer',
        path: formPath,
        completed: function() {
          $timeout(function() {
            vm.loadedForm = {};
          }, 3000);
        }
      });

    };

    vm.isFormLoaded = function() {
      return !_.isEmpty(vm.loadedForm);
    };
  }
}());
