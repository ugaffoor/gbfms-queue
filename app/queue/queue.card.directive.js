(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .directive('queueCard', queueCard);

  /* @ngInject */
  function queueCard() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        queueItem: '='
      },
      link: link,
      templateUrl: 'queue/queue.card.tpl.html'
    };
    return directive;

    function link(scope) {
      scope.queue = scope.$parent.queue;
    }
  }
})();
