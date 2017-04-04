( function() {
  'use strict';
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueController', QueueController);

  /* @ngInject */
  function QueueController(currentKapp, currentUser, forms, teams, filters, urlFilterOptions, queueName, queueDetailsValue, queueCompletedValue, queueSummaryValue, AssignmentService, Bundle, TeamModel, md5, $interval, $rootScope, $scope, $state, $uibModal) {
    var STATE_MATCH_DETAILS = /queue\.by\./;
    var STATE_MATCH_LIST = /queue\.by/;
    var queue = this;
    queue.currentKapp = currentKapp;
    queue.filters = filters;
    queue.queueName = queueName;
    queue.filterName = '';
    queue.recordCount = 0;
    queue.activeFilter = {};
    queue.loading = false;
    queue.hideListOnXS = true;
    queue.hideFiltersOnXS = true;
    queue.xsView = 'details';

    queue.refresh = refresh;
    queue.changeFilter = changeFilter;
    queue.friendlyAssignedName = friendlyAssignedName;
    queue.friendlyAssignedTeam = friendlyAssignedTeam;
    queue.friendlyAssignedUsername = friendlyAssignedUsername;
    queue.friendlyDueDate = friendlyDueDate;
    queue.friendlyDetails = friendlyDetails;
    queue.friendlyCompleted = friendlyCompleted;
    queue.friendlyPendingReason = friendlyPendingReason;
    queue.hasPendingReason = hasPendingReason;
    queue.hasCompleted = hasCompleted;
    queue.hasDetails = hasDetails;
    queue.hasDiscussion = hasDiscussion;
    queue.canDiscuss = canDiscuss;
    queue.discussionGuid = discussionGuid;
    queue.friendlySummary = friendlySummary;
    queue.friendlyStatus = friendlyStatus;
    queue.isOverdue = isOverdue;
    queue.imagePath = imagePath;
    queue.filterChangeCount = filterChangeCount;
    queue.isChildState = isChildState;
    queue.isSelectedFilter = isSelectedFilter;
    queue.filterIsSelectable = filterIsSelectable;

    queue.shouldShowFilters = shouldShowFilters;
    queue.shouldShowList = shouldShowList;
    queue.shouldShowTeams = shouldShowTeams;
    queue.showList = showList;
    queue.showFilters = showFilters;
    queue.showDetails = showDetails;

    queue.newItemModal = newItemModal;

    queue.sortBy = 'updated';
    queue.sortDir = 'desc';
    queue.assignmentType = {
      mine: false,
      none: false,
      others: false
    };
    queue.stateActive = false;
    queue.stateInactive = false;
    queue.closedToday = false;

    queue.setActiveFilter = function(filter) {
      queue.sortBy = filter.filterOptions.sortBy;
      queue.sortDir = filter.filterOptions.sortDir;
      queue.assignmentType = {
        mine: filter.filterOptions.assignmentMine,
        none: filter.filterOptions.assignmentNone,
        others: filter.filterOptions.assignmentOthers
      };
      queue.stateActive = filter.filterOptions.stateActive;
      queue.stateInactive = filter.filterOptions.stateInactive;
      queue.closedToday = filter.filterOptions.closedToday;
    }
    queue.changeSortBy = function() {
      $state.go('.', {sortBy: queue.sortBy}, {reload:true});
    };

    queue.changeSortDir = function() {
      $state.go('.', {sortDir: queue.sortDir}, {reload:true});
    };

    queue.changeAssignmentMine = function() {
      $state.go('.', {assignmentMine: queue.assignmentType.mine}, {reload:true});
    };

    queue.changeAssignmentNone = function() {
      $state.go('.', {assignmentNone: queue.assignmentType.none}, {reload:true});
    };

    queue.changeAssignmentOthers = function() {
      $state.go('.', {assignmentOthers: queue.assignmentType.others}, {reload:true});
    };

    queue.changeStateActive = function() {
      $state.go('.', {stateActive: queue.stateActive}, {reload:true});
    };

    queue.changeStateInactive = function() {
      $state.go('.', {stateInactive: queue.stateInactive}, {reload:true});
    };

    queue.changeClosedToday = function() {
      $state.go('.', {closedToday: queue.closedToday}, {reload:true});
    };

    activate();

    function refresh() {
      $state.go('.', {}, {reload: true});
    }

    function changeFilter() {
      var params = {filterName:queue.filterName};
      if(queue.filterName === 'Mine') {
        params.assignmentMine = true;
        params.assignmentOthers = false;
        params.assignmentNone = false;
        params.stateActive = true;
        params.stateInactive = false;
        params.closedToday = false;
      } else if(queue.filterName === 'Available') {
        params.assignmentMine = false;
        params.assignmentOthers = false;
        params.assignmentNone = true;
        params.stateActive = true;
        params.stateInactive = false;
        params.closedToday = false;
      } else {
        // Handle the normal 'teams' situation.
        params.assignmentMine = true;
        params.assignmentOthers = false;
        params.assignmentNone = true;
        params.stateActive = true;
        params.stateInactive = false;
        params.closedToday = false;
      }
      $state.go('queue.by', params, {reload:true});
    }

    function filterIsSelectable() {
      return queue.filterName && queue.filterName !== '__show__';
    }

    function isSelectedFilter(filter) {
      if(filter.name !== '__show__') {
        return filter.name === queue.filterName;
      }
      return false;
    }

    function friendlyDetails(item) {
      return item.values[queueDetailsValue] || '';
    }

    function isChildState(matcher) {
      matcher = matcher || STATE_MATCH_DETAILS;
      var currentState = $state.current.name;
      return currentState.match(matcher) !== null;
    }

    function shouldShowFilters() {
      return queue.xsView === 'filters';
    }

    function shouldShowList() {
      return queue.xsView === 'list' || !queue.isChildState();
    }

    function shouldShowTeams() {
      var invalid_teams = [
        'Mine',
        'All',
        '__show__'
      ];
      return queue.filterName && invalid_teams.indexOf(queue.filterName) === -1;
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

    function canDiscuss(item) {
      return Object.keys(item.values).indexOf('Discussion Id') !== -1;
    }

    function discussionGuid(item) {
      return item.values['Discussion Id'];
    }

    function hasDiscussion(item) {
      return canDiscuss(item) ? !_.isEmpty(item.values['Discussion Id']) : false;
    }

    function friendlyPendingReason(item) {
      return item.values['Pending Reason'] || '';
    }

    function friendlyCompleted(item) {
      return item.values[queueCompletedValue] || '';
    }

    function hasPendingReason(item) {
      return !_.isEmpty(item.values['Pending Reason']);
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

    function friendlyAssignedUsername(item) {
      return item.values['Assigned Individual'] || '';
    }

    function friendlyAssignedTeam(item) {
      var friendlyName = 'Unassigned';
      var assignedTeam = AssignmentService.withoutRoot(item.values['Assigned Team']);
      if(!_.isEmpty(assignedTeam)) {
        friendlyName = assignedTeam;
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

    function newItemModal() {
      var modalInstance = $uibModal.open({
        templateUrl: 'queue/queue.new.item.modal.html',
        controller: 'QueueNewItemModalController as vm',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          currentUser: function() {
            return currentUser;
          },
          activeTeam: function() {
            return queue.filterName;
          },
          formsForTeam: function() {
            var activeTeams = [queue.filterName];
            if(['Available', 'Mine', 'All'].indexOf(queue.filterName) > -1 ) {
              activeTeams = _.map(currentUser.memberships, function(membership) {
                return membership.team.name;
              });
            }

            var workItemForms = _.filter(forms, function(form) {
              return form.type === 'Task' && form.status === 'Active';
            });
            return _.filter(workItemForms, function(form) {
              var owningTeam = _.find(form.attributes, {name: 'Owning Team'});
              return angular.isDefined(owningTeam) ? _.intersection(owningTeam.values, activeTeams).length > 0 : false;
            });
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
