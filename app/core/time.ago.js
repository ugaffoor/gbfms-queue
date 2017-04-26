import angular from 'angular';
import moment from 'moment';
import _ from 'lodash';

// If Response is not enabled, then include this directive, since the names collide right now.
if(!(bundle && bundle.config && bundle.config.queue && bundle.config.queue.discussion)) {
  angular
    .module('kd.core')
    .directive('timeAgo', TimeAgo);
}

function TimeAgo($interval)  {
  'ngInject';

  return {
    restrict: 'EA',
    replace: true,
    template: '<span uib-tooltip="{{tooltipText}}" tooltip-append-to-body="true">{{timeAgoText}}</span>',
    scope: {
      timeAgo: '='
    },
    link: link
  };

  function link(scope, element, attributes) {
    var applyTimeAgo = function() {
      var prefixText = '';
      if(!_.isEmpty(attributes.timeAgoPrefix)) {
        prefixText = attributes.timeAgoPrefix;
      }

      if(angular.isUndefined(scope.timeAgo) || scope.timeAgo === null) {
        scope.timeAgoText = 'N/A';
        scope.tooltipText = 'N/A';
      } else {
        var m = moment(scope.timeAgo);
        scope.tooltipText = prefixText + ' ' + m.format('MMMM Do YYYY, h:mm:ss A');
        scope.timeAgoText = prefixText + ' ' + m.fromNow();
      }
    };

    // Register an interval to update the moment time-ago display, so that the counter increments as expected.
    var interval = $interval(applyTimeAgo, 10000);

    // Register a watch that will apply the moment time-ago display whenever the underlying date/time is changed.
    scope.$watch('timeAgo', applyTimeAgo);

    // When the directive is destroyed make sure that we clean up the interval.
    scope.$on('$destroy', function() {
      $interval.cancel(interval);
    });

  }
};
