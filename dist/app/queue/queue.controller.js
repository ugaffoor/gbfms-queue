( function() {
  'use strict';
  QueueController.$inject = ["currentKapp", "currentUser", "forms", "teams", "teamsKapp", "filters", "queueName", "queueDetailsValue", "queueCompletedValue", "queueSummaryValue", "AssignmentService", "Bundle", "TeamModel", "md5", "$interval", "$rootScope", "$scope", "$state", "$uibModal"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueController', QueueController);

  /* @ngInject */
  function QueueController(currentKapp, currentUser, forms, teams, teamsKapp, filters, queueName, queueDetailsValue, queueCompletedValue, queueSummaryValue, AssignmentService, Bundle, TeamModel, md5, $interval, $rootScope, $scope, $state, $uibModal) {
    var STATE_MATCH_DETAILS = /queue\.by\./;
    var STATE_MATCH_LIST = /queue\.by/;
    var queue = this;
    queue.currentKapp = currentKapp;
    queue.filters = filters;
    queue.queueName = queueName;
    queue.filterName = '';
    queue.FILTER_TYPES = [
      'Open',
      'Due Today',
      'Past Due',
      'Recent Hour',
      'Recent Day'
    ];
    queue.loading = false;
    queue.hideListOnXS = true;
    queue.hideFiltersOnXS = true;
    queue.xsView = 'details';

    queue.changeFilter = changeFilter;
    queue.friendlyAssignedName = friendlyAssignedName;
    queue.friendlyAssignedTeam = friendlyAssignedTeam;
    queue.friendlyAssignedUsername = friendlyAssignedUsername;
    queue.friendlyDueDate = friendlyDueDate;
    queue.friendlyDetails = friendlyDetails;
    queue.friendlyCompleted = friendlyCompleted;
    queue.hasCompleted = hasCompleted;
    queue.hasDetails = hasDetails;
    queue.hasDiscussion = hasDiscussion;
    queue.canDiscuss = canDiscuss;
    queue.responseGuid = responseGuid;
    queue.hasTeamsKapp = hasTeamsKapp;
    queue.getTeamLink = getTeamLink;
    queue.getUserLink = getUserLink;
    queue.friendlySummary = friendlySummary;
    queue.friendlyStatus = friendlyStatus;
    queue.isOverdue = isOverdue;
    queue.imagePath = imagePath;
    queue.filterChangeCount = filterChangeCount;
    queue.isChildState = isChildState;
    queue.isFilterActive = isFilterActive;
    queue.isSelectedFilter = isSelectedFilter;
    queue.filterIsSelectable = filterIsSelectable;

    queue.shouldShowFilters = shouldShowFilters;
    queue.shouldShowList = shouldShowList;
    queue.shouldShowTeams = shouldShowTeams;
    queue.showList = showList;
    queue.showFilters = showFilters;
    queue.showDetails = showDetails;

    queue.populateStats = populateStats;
    queue.newItemModal = newItemModal;

    activate();

    function changeFilter() {
      $state.go('queue.by', {filterName:queue.filterName, filterType: 'Open'}, {reload:true});
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

    function isFilterActive(filterType) {
      return (isChildState(STATE_MATCH_LIST) && queue.filterType === filterType);
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

    function hasTeamsKapp() {
      return !_.isEmpty(teamsKapp);
    }


    function canDiscuss(item) {
      return Object.keys(item.values).indexOf('Response GUID') !== -1;
    }

    function responseGuid(item) {
      return item.values['Response GUID'];
    }

    function hasDiscussion(item) {
      return canDiscuss(item) ? !_.isEmpty(item.values['Response GUID']) : false;
    }

    function getTeamLink(team) {
      team = team || queue.filterType;
      var teamHash = md5.createHash(team);
      return Bundle.spaceLocation() + '/' + teamsKapp + '?page=team&team=' + teamHash;
    }

    function getUserLink(username) {
      return Bundle.spaceLocation() + '/' + teamsKapp + '?page=user&username=' + username;
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

    function populateStats() {
      queue.stats = {
        pastDue: 0,
        dueToday: 0,
        totalOpen: queue.openItems.length,
        teamMembers: 0,
        activeMembers: 0
      };

      _.each(queue.openItems, function(item) {
        // Check for a Due Date.
        var dueDate = moment(item.values['Due Date']);
        var today = moment();
        if(dueDate.isValid()) {
          if(dueDate.isSame(today.startOf('day'), 'd')) {
            queue.stats.dueToday++;
          } else if(dueDate.isBefore(today.startOf('day'))) {
            queue.stats.pastDue++;
          }
        }
      });

      if(shouldShowTeams()) {
        TeamModel.build().one(md5.createHash(queue.filterName)).get({include:'memberships,memberships.user'}).then(function(team) {
          queue.stats.teamMembers = team.memberships.length;
        });

        var recentItems = _.filter(queue.openItems, function(item) {
          return moment().diff(item.updatedAt, 'minutes') <= 30;
        });
        var recentMembers = _.map(recentItems, function(item) {
          return item.updatedBy;
        });
        var members = _.uniq(recentMembers);
        queue.stats.activeMembers = members.length;
      }
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
            var activeTeam = queue.filterName;
            return _.filter(forms, function(form) {
              var serviceOwnerTeam = _.find(form.attributes, {name: 'Service Owner Team'});
              return angular.isDefined(serviceOwnerTeam) ? serviceOwnerTeam.values.indexOf(activeTeam) !== -1 : false;
            });
          }
        }
      })
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
