(function() {
  'use strict';
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueController', QueueController);

  /* @ngInject */
  function QueueController(currentKapp, filters, queueName, queueDetailsValue, queueCompletedValue, queueSummaryValue, AssignmentService, Bundle, $interval, $rootScope, $scope, $state) {
    var STATE_MATCH = /queue\.by\./;
    var queue = this;
    queue.currentKapp = currentKapp;
    queue.filters = filters;
    queue.queueName = queueName;
    queue.filterName = '';
    queue.FILTER_TYPES = [
      'Open',
      'Due Today',
      'Backlog',
      'Recent Hour',
      'Recent Day'
    ];
    queue.loading = false;
    queue.hideListOnXS = true;
    queue.hideFiltersOnXS = true;
    queue.xsView = 'details';

    queue.changeFilter = changeFilter;
    queue.friendlyAssignedName = friendlyAssignedName;
    queue.friendlyAssignedGroup = friendlyAssignedGroup;
    queue.friendlyDueDate = friendlyDueDate;
    queue.friendlyDetails = friendlyDetails;
    queue.friendlyCompleted = friendlyCompleted;
    queue.hasCompleted = hasCompleted;
    queue.hasDetails = hasDetails;
    queue.friendlySummary = friendlySummary;
    queue.friendlyStatus = friendlyStatus;
    queue.isOverdue = isOverdue;
    queue.imagePath = imagePath;
    queue.filterChangeCount = filterChangeCount;
    queue.isChildState = isChildState;

    queue.shouldShowFilters = shouldShowFilters;
    queue.shouldShowList = shouldShowList;
    queue.shouldShowTeams = shouldShowTeams;
    queue.showList = showList;
    queue.showFilters = showFilters;
    queue.showDetails = showDetails;

    queue.populateStats = populateStats;

    activate();

    function changeFilter() {
      $state.go('queue.by', {filterName:queue.filterName}, {reload:true});
    }

    function friendlyDetails(item) {
      return item.values[queueDetailsValue] || '';
    }

    function isChildState() {
      var currentState = $state.current.name;
      return currentState.match(STATE_MATCH) !== null;
    }

    function shouldShowFilters() {
      return queue.xsView === 'filters';
    }

    function shouldShowList() {
      return queue.xsView === 'list' || !queue.isChildState();
    }

    function shouldShowTeams() {
      return queue.filterName && queue.filterName !== 'Mine' && queue.filterName !== 'All';
    }

    function showList() {
      queue.xsView = 'list';
    }

    function showFilters() {
      queue.xsView = 'filters';
    }

    function showDetails() {
      queue.xsView = 'details';
    }

    function hasDetails(item) {
      return !_.isEmpty(item.values[queueDetailsValue]);
    }

    function friendlyCompleted(item) {
      return item.values[queueCompletedValue] || '';
    }

    function hasCompleted(item) {
      return !_.isEmpty(item.values[queueCompletedValue]);
    }

    function friendlySummary(item) {
      return item.values[queueSummaryValue] || '';
    }

    function friendlyAssignedName(item) {
      var assignedName = item.values['Assigned Individual Display Name'];
      var assignedId = item.values['Assigned Individual'];
      var friendlyName = 'Unassigned';

      if(!_.isEmpty(assignedName)) {
        friendlyName = assignedName;
      } else if(!_.isEmpty(assignedId)) {
        friendlyName = assignedId;
      }
      return friendlyName;
    }

    function friendlyAssignedGroup(item) {
      var friendlyName = 'Unassigned';
      var assignedGroup = AssignmentService.withoutRoot(item.values['Assigned Group']);
      if(!_.isEmpty(assignedGroup)) {
        friendlyName = assignedGroup;
      }

      return friendlyName;
    }

    function friendlyDueDate(item) {
      var dueDate = item.values['Due Date'];
      return dueDate;
    }

    function friendlyStatus(item) {
      var status = item.values['Status'];

      return status;
    }

    function isOverdue(dueDate) {
      var now = moment(new Date());
      return now.isAfter(moment(dueDate));
    }

    function imagePath(image) {
      return Bundle.location() + '/' + image;
    }

    function filterChangeCount(index) {
      return 42;
    }

    function populateStats() {
      queue.stats = {
        backlog: 0,
        dueToday: 0,
        totalOpen: queue.openItems.length
      };

      _.each(queue.openItems, function(item) {
        // Check for a Due Date.
        var dueDate = moment(item.values['Due Date']);
        var today = moment();
        if(dueDate.isValid()) {
          if(dueDate.isSame(today.startOf('day'), 'd')) {
            queue.stats.dueToday++;
          } else if(dueDate.isBefore(today.startOf('day'))) {
            queue.stats.backlog++;
          }
        }
      });
    }

    function activate() {
      // The queue list controller will broadcast that it changed the filter.
      // This helps us with knowing what the active filter is when the child
      // state is loaded directly.
      // $rootScope.$on('$queueFilterChange', function(event, filterName) {
      //   vm.activeFilter = filterName;
      // });

      // We'll also listen for state changes when this controller is still visible.
      // If the state doesn't start with queue.by it is a change to a state which
      // is not filtering, so we'll blank out the active filter.
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
        if(!_.startsWith(toState.name, 'queue.by')) {
          queue.filterName = '';
        }
      });

      var filterCheck = $interval(function() {
        // We'll do something fancy here.
      }, 5000);

      $scope.$on('$destroy', function() {
        $interval.cancel(filterCheck);
      });
    }
  }
}());
