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
        discussionServer: '='
      },
      link: link,
      templateUrl: 'queue/queue.card.tpl.html'
    };
    return directive;

    function link(scope, element, attributes) {
      scope.queue = scope.$parent.queue;
      scope.isSummary = isSummary;
      scope.isListView = isListView;
      scope.isDiscussion = isDiscussion;
      scope.dateDisplay = angular.isDefined(attributes.dateDisplay) ? attributes.dateDisplay : 'updated';

      scope.shouldTeamLink = function() {
        return scope.queue.hasTeamsKapp() && scope.queue.friendlyAssignedTeam(scope.queueItem) !== 'Unassigned';
      };

      scope.shouldUserLink = function() {
        return scope.queue.hasTeamsKapp() && scope.queue.friendlyAssignedUsername(scope.queueItem) !== '';
      };

      function isListView() {
        return !_.isEmpty(attributes.listView);
      }

      function isDiscussion() {
        // Don't render the Discussion card in the list view.
        if(isListView()) {
          return false;
        }

        // If there's no valid server then don't render it.
        if(_.isEmpty(scope.discussionServer)) {
          return false;
        }

        var discussionSubtaskAttribute = _.find(scope.queueItem.form.attributes, {name: 'Discussion Subtask'});
        return angular.isDefined(discussionSubtaskAttribute) && discussionSubtaskAttribute.values[0].toUpperCase() === 'TRUE';
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
