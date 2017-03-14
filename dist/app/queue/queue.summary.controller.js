(function() {
  'use strict';

  QueueSummaryController.$inject = ["item", "subtasks", "notes", "relatedItems", "queueResponseServer", "AssignmentService", "Bundle", "Toast", "$scope", "$state", "$timeout", "$http"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSummaryController', QueueSummaryController);

  /* @ngInject */
  function QueueSummaryController(item, subtasks, notes, relatedItems, queueResponseServer, AssignmentService, Bundle, Toast, $scope, $state, $timeout, $http) {
    var vm = this;
    var layout = $scope.layout;
    var details = $scope.details;

    // MEMBERS
    vm.item = item;
    vm.notes = notes;
    vm.relatedItems = relatedItems;
    vm.isAssigningTeam = false;
    vm.isAssigningMember = false;
    vm.isLoading = false;
    vm.membersForTeam = [];
    vm.subtasks = subtasks;
    vm.showNotes = false;
    vm.responseServer = queueResponseServer;

    // METHODS
    vm.grabIt = grabIt;
    vm.startMemberAssignment = startMemberAssignment;
    vm.stopMemberAssignment = stopMemberAssignment;
    vm.memberSelected = memberSelected;
    vm.startTeamAssignment = startTeamAssignment;
    vm.stopTeamAssignment = stopTeamAssignment;
    vm.teamSelected = teamSelected;

    vm.startNewDiscussion = startNewDiscussion;

    vm.inWorkOrReview = inWorkOrReview;
    vm.inSubtask = inSubtask;

    vm.toggleNotes = toggleNotes;

    vm.showQueueIcon = showQueueIcon;
    vm.showRequestIcon = showRequestIcon;
    vm.originLink = originLink;

    activate();

    function activate() {}

    function startNewDiscussion() {
      $http({
        url: queueResponseServer + '/api/v1/issues',
        method: 'POST',
        data: {
          name: vm.item.label,
          description: vm.item.label,
          tag_list: ['META:TYPE:Submission', 'META:ID:'+vm.item.id, 'META:LABEL:Open Task', 'META:URL:'+window.location.toString()].join(',')
        }
      }).then(
        function success(response) {
          vm.item.values['Response GUID'] = response.data.guid;
          var originalCoreState = vm.item.coreState;
          delete vm.item.currentPage;
          delete vm.item.coreState;

          // Save.
          vm.item.put().then(
            function success() {
              vm.item.coreState = originalCoreState;
              Toast.success('Started new discussion!');
              $state.go('queue.by.details.discuss');
            },
            function error() {
              Toast.error('Failed to update item with discussion.');
            }
          );
        },
        function error() {
          Toast.error('Failed to start Response Discussion. Contact your system administrator.');
        }
      );
    }

    function startMemberAssignment() {
      if(vm.isAssigningTeam) return;
      if(_.isEmpty(AssignmentService.withoutRoot(vm.item.values['Assigned Team']))) {
        vm.startTeamAssignment();
        return;
      }

      AssignmentService.getMembers(vm.item.values['Assigned Team']).then(
        function success(members) {
          vm.membersForTeam = members;
          vm.membersForTeam.unshift({username: '', displayName: 'Unassigned'});
          vm.isAssigningMember = true;

          $timeout(function() {
            document.getElementById('member-selector').focus();
          }, 100);
        },
        function failure() {
          Toast.error('There was a problem retrieving members for the current team!');
        });
    }

    function stopMemberAssignment() {
      vm.isAssigningMember = false;
    }


    function memberSelected(member) {
      vm.isLoading = true;
      delete vm.item.currentPage;
      delete vm.item.coreState;
      vm.item.values['Assigned Individual'] = member.username;
      vm.item.values['Assigned Individual Display Name'] = member.displayName;

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned individual!");
          vm.isLoading = false;
          vm.isAssigningMember = false;
          $state.go('queue.by.details.summary', {}, {reload:true});
        });
    }

    function startTeamAssignment() {
      if(vm.isAssigningMember) return;

      AssignmentService.getAllTeams().then(
        function success(teams) {
          vm.isAssigningTeam = true;
          var validTeams = _.filter(teams, function(team) {
            // Find the Assignable attribute.
            var assignable = _.find(team.attributes, function(attribute) {
              return attribute.name === 'Assignable';
            });

            // Check the Assignable attribute - teams are only assignable if they are explicitly set
            // to TRUE or YES. Otherwise it is assumed they are unassignable.
            var isValid = false;
            if(!_.isEmpty(assignable) && ['YES', 'TRUE'].indexOf(assignable.values[0].toUpperCase()) !== -1) {
              isValid = true;
            }

            return isValid;
          });
          vm.allTeams = _.map(validTeams, function(team) {
            var teamName = AssignmentService.withoutRoot(team.name);
            return { label: teamName, team: teamName };
          });
          vm.allTeams.unshift({label: 'Unassign', team: ''});

          // Focus on the team selector.
          $timeout(function() {
            document.getElementById('team-selector').focus();
          }, 100);
        },
        function failure() {
          Toast.error('Failed to retrieve team information - assignment disabled.');
        });
    }

    function stopTeamAssignment() {
      vm.isAssigningTeam = false;
    }

    function teamSelected(team) {
      vm.isLoading = true;

      delete vm.item.currentPage;
      delete vm.item.coreState;
      vm.item.values['Assigned Team'] = AssignmentService.withRoot(team.team);
      vm.item.values['Assigned Individual'] = '';
      vm.item.values['Assigned Individual Display Name'] = '';

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned team!");
          vm.isLoading = false;
          vm.isAssigningTeam = false;
          $state.go('queue.by.details.summary', {}, {reload:true});
        },
        function failure() {
          Toast.error('There was a problem reassigning the team!');
          $state.go('.', {}, {reload:true});
        });
    }

    function grabIt() {
      AssignmentService.grabIt(layout.currentUser.username, item.values['Assigned Team'], item).then(
        function() {
          Toast.success('Grabbed item.');
          $state.go('queue.by.details.summary.work', {}, {reload:true});
        },
        function(error) {
          // Display the error information to the user.
          Toast.error(error);
          // And then start team assignment.
          vm.startTeamAssignment();
        }
      );
    }

    function inWorkOrReview() {
      return $state.current.name === 'queue.by.details.summary.work';
    }

    function inSubtask() {
      return $state.current.name === 'queue.by.details.summary.task';
    }

    function toggleNotes() {
      vm.showNotes = !vm.showNotes;
    }

    function showQueueIcon() {
      // If the parent isn't null, and there is an origin and the parent is not the same as the origin.
      if(vm.item.origin !== null) {
        return vm.item.parent !== null && vm.item.origin.id !== vm.item.parent.id;
      }
      return vm.item.parent !== null;
    };

    function showRequestIcon() {
      // if the origin isn't null and the parent is the same.
      if(vm.item.origin !== null) {
        return vm.item.parent !== null && vm.item.origin.id === vm.item.parent.id;
      }
      return false;
    };

    function originLink() {
      return Bundle.spaceLocation() + '/submissions/' + vm.item.origin.id + '?review';
    };
  }
}());
