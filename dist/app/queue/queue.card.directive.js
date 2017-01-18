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
        queueItem: '=',
        responseServer: '='
      },
      link: link,
      templateUrl: 'queue/queue.card.tpl.html'
    };
    return directive;

    function link(scope, element, attributes) {
      scope.queue = scope.$parent.queue;
      scope.isSummary = isSummary;
      scope.isListView = isListView;
      scope.isResponse = isResponse;

      function isListView() {
        return !_.isEmpty(attributes.listView);
      }

      function isResponse() {
        // Don't render the Response card in the list view.
        if(isListView()) {
          return false;
        }

        // If there's no valid server then don't render it.
        if(_.isEmpty(scope.responseServer)) {
          return false;
        }

        var responseSubtaskAttribute = _.find(scope.queueItem.form.attributes, {name: 'Response Subtask'});
        return angular.isDefined(responseSubtaskAttribute) && responseSubtaskAttribute.values[0].toUpperCase() === 'TRUE';
      }

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
