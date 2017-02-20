(function() {
  'use strict';

  FilterQualificationController.$inject = ["filter", "$scope"];
  angular
    .module('kd.bundle.angular.queue.setup')
    .controller('FilterQualificationController', FilterQualificationController);

  /* @ngInject */
  function FilterQualificationController(filter, $scope) {
    var vm = this;
    var filterFields = [
      'Assigned Individual',
      'Assigned Individual Display Name',
      'Assigned Group',
      'Assigned Group Display Name',
      'Deferral Token',
      'Due',
      'Status'
    ];
    vm.filter = filter;
    vm.tmpQualification = {};
    vm.resetTempQualification = resetTempQualification;
    vm.addQualification = addQualification;
    vm.removeQualification = removeQualification;
    vm.save = save;

    activate();

    function addQualification() {
      vm.filter.qualifications.push(vm.tmpQualification);
      resetTempQualification();
    }

    function removeQualification(index) {
      vm.filter.qualifications.splice(index, 1);
    }

    function resetTempQualification() {
      vm.tmpQualification = {
        field: '',
        value: ''
      };
    }

    function save() {
      $scope.$close(vm.filter);
    }

    function activate() {
      // Populate the "available filter values". These are the fields we know we can filter on for sure, since they're
      // expected to be on all queue item forms.h
      vm.filterableValues = _.map(filterFields, function(field) {
        return 'values['+field+']';
      });
      vm.filterableValues.push('coreState');

      resetTempQualification();

      if(!(vm.filter.qualifications instanceof Array)) {
        vm.filter.qualifications = [];
      }
    }
  }
}());
