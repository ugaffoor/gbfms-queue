(function() {
  'use strict';

  angular
    .module('kd.core')
    .directive('statusLabel', statusLabel);

  /* @ngInject */
  function statusLabel() {
    // Usage:
    // <status-label data-status="item.status"></status-label>
    var directive = {
      link: link,
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        status: '=',
        activeStatuses: '=',
        inactiveStatuses: '=',
        cancelledStatuses: '='
      },
      template: '<span class="label" data-ng-class="getClass()")>{{status}}</span>'
    };
    return directive;

    function link(scope) {
      function hasStatus(statuses, status) {
        return _.includes(statuses, status);
      }

      scope.getClass = function() {
        if(hasStatus(scope.activeStatuses, scope.status)) {
          return 'label-success';
        } else if(hasStatus(scope.inactiveStatuses, scope.status)) {
          return 'label-warning';
        } else if(hasStatus(scope.cancelledStatuses, scope.status)) {
          return 'label-danger';
        } else {
          return 'label-default';
        }
      };
    }
  }
})();
