(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSummaryController', QueueSummaryController);

  /* @ngInject */
  function QueueSummaryController(item, subtasks, notes, relatedItems, AssignmentService, Bundle, Toast, $scope, $state, $timeout) {
    var vm = this;
    var layout = $scope.layout;
    var details = $scope.details;

    // MEMBERS
    vm.item = item;
    vm.notes = notes;
    vm.relatedItems = relatedItems;
    vm.isAssigningGroup = false;
    vm.isAssigningMember = false;
    vm.isLoading = false;
    vm.membersForGroup = [];
    vm.subtasks = subtasks;
    vm.showNotes = false;

    // METHODS
    vm.grabIt = grabIt;
    vm.startMemberAssignment = startMemberAssignment;
    vm.stopMemberAssignment = stopMemberAssignment;
    vm.memberSelected = memberSelected;
    vm.startGroupAssignment = startGroupAssignment;
    vm.stopGroupAssignment = stopGroupAssignment;
    vm.groupSelected = groupSelected;

    vm.inWorkOrReview = inWorkOrReview;
    vm.inSubtask = inSubtask;

    vm.toggleNotes = toggleNotes;

    vm.showQueueIcon = showQueueIcon;
    vm.showRequestIcon = showRequestIcon;
    vm.originLink = originLink;

    activate();

    function activate() {}

    function startMemberAssignment() {
      if(vm.isAssigningGroup) return;
      if(_.isEmpty(AssignmentService.withoutRoot(vm.item.values['Assigned Group']))) {
        vm.startGroupAssignment();
        return;
      }

      AssignmentService.getMembers(vm.item.values['Assigned Group']).then(
        function success(members) {
          vm.membersForGroup = _.map(members, function(member) {
            return member.values['Username'];
          });
          vm.membersForGroup.unshift('');
          vm.isAssigningMember = true;

          $timeout(function() {
            document.getElementById('member-selector').focus();
          }, 100);
        },
        function failure() {
          Toast.error('There was a problem retrieving members for the current group!');
        });
    }

    function stopMemberAssignment() {
      vm.isAssigningMember = false;
    }


    function memberSelected(member) {
      vm.isLoading = true;
      delete vm.item.currentPage;
      delete vm.item.coreState;
      vm.item.values['Assigned Individual'] = member;
      vm.item.values['Assigned Individual Display Name'] = member;

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned individual!");
          vm.isLoading = false;
          vm.isAssigningMember = false;
          $state.go('queue.by.details.summary', {}, {reload:true});
        });
    }

    function startGroupAssignment() {
      if(vm.isAssigningMember) return;

      AssignmentService.getAllGroups().then(
        function success(groups) {
          vm.isAssigningGroup = true;
          vm.allGroups = _.map(groups, function(group) {
            var groupName = AssignmentService.withoutRoot(group.values['Name']);
            return { label: groupName, group: groupName };
          });
          vm.allGroups.unshift({label: 'Unassign', group: ''});

          // Focus on the group selector.
          $timeout(function() {
            document.getElementById('group-selector').focus();
          }, 100);
        },
        function failure() {
          Toast.error('Failed to retrieve group information - assignment disabled.');
        });

    }

    function stopGroupAssignment() {
      vm.isAssigningGroup = false;
    }

    function groupSelected(group) {
      vm.isLoading = true;

      delete vm.item.currentPage;
      delete vm.item.coreState;
      vm.item.values['Assigned Group'] = AssignmentService.withRoot(group.group);
      vm.item.values['Assigned Individual'] = '';
      vm.item.values['Assigned Individual Display Name'] = '';

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned group!");
          vm.isLoading = false;
          vm.isAssigningGroup = false;
          $state.go('queue.by.details.summary', {}, {reload:true});
        },
        function failure() {
          Toast.error('There was a problem reassigning the group!');
          $state.go('.', {}, {reload:true});
        });
    }

    function grabIt() {
      AssignmentService.grabIt(layout.currentUser.username, item.values['Assigned Group'], item).then(
        function() {
          Toast.success('Grabbed item.');
          $state.go('.', {}, {reload:true});
        },
        function(error) {
          // Display the error information to the user.
          Toast.error(error);
          // And then start group assignment.
          vm.startGroupAssignment();
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
