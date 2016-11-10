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
      scope.isSummary = isSummary;

      function isSummary() {
        var summaryAttribute = _.find(scope.queueItem.form.attributes, {name: 'Summary Card View'});
        if(typeof summaryAttribute !== 'undefined' && !_.isEmpty(summaryAttribute.values[0])) {
          return ("TRUE" === summaryAttribute.values[0].toUpperCase() ||
                  "YES" === summaryAttribute.values[0].toUpperCase());
        }
        return false;
      }
    }
  }
})();
