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
        status: '='
      },
      template: '<span class="label" data-ng-class="getClass()")>{{status}}</span>'
    };
    return directive;

    function link(scope) {
      scope.getClass = function() {
        var statuses = {
          // Forms
          'Open' : 'label-success',
          'In Progress' : 'label-success',
          'Pending' : 'label-warning',
          'Complete' : 'label-default',
          'Cancelled' : 'label-danger'
        };
        return statuses[scope.status];
      };
    }
  }
})();
