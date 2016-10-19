(function() {
  'use strict';

  QueueSummaryController.$inject = ["item", "AssignmentService", "Toast", "$scope", "$state", "$timeout"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSummaryController', QueueSummaryController);

  /* @ngInject */
  function QueueSummaryController(item, AssignmentService, Toast, $scope, $state, $timeout) {
    var vm = this;
    var layout = $scope.layout;

    vm.item = item;
    vm.isAssigningGroup = false;
    vm.isAssigningMember = false;
    vm.isLoading = false;
    vm.membersForGroup = [];

    vm.grabIt = grabIt;

    vm.startMemberAssignment = function() {
      if(vm.isAssigningGroup) return;
      AssignmentService.getMembers(vm.item.values['Assigned Group']).then(
        function success(members) {
          vm.membersForGroup = _.map(members, function(member) {
            return member.values['Username'];
          });
          vm.isAssigningMember = true;

          $timeout(function() {
            document.getElementById('member-selector').focus();
          }, 100);
        },
        function failure() {
          Toast.error('There was a problem retrieving members for the current group!');
        });
    };

    vm.stopMemberAssignment = function() {
      vm.isAssigningMember = false;
    };

    vm.memberSelected = function(member) {
      vm.isLoading = true;
      delete vm.item.currentPage;
      vm.item.values['Assigned Individual'] = member;
      vm.item.values['Assigned Individual Display Name'] = member;

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned individual!");
          vm.isLoading = false;
          vm.isAssigningMember = false;
          $state.go('.', {}, {reload:true});
        });
    };

    vm.startGroupAssignment = function() {
      if(vm.isAssigningMember) return;
      vm.isAssigningGroup = true;
      $timeout(function() {
        document.getElementById('group-selector').focus();
      }, 100);
    };

    vm.stopGroupAssignment = function() {
      vm.isAssigningGroup = false;
    };

    vm.groupSelected = function(group) {
      vm.isLoading = true;
      delete vm.item.currentPage;


      vm.item.values['Assigned Group'] = AssignmentService.withRoot(group.group);
      vm.item.values['Assigned Individual'] = '';
      vm.item.values['Assigned Individual Display Name'] = '';

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned group!");
          vm.isLoading = false;
          vm.isAssigningGroup = false;
          $state.go('.', {}, {reload:true});
        },
        function failure() {
          Toast.error('There was a problem reassigning the group!');
          $state.go('.', {}, {reload:true});
        });
    };

    activate();

    function activate() {
      AssignmentService.getAllGroups().then(
        function success(groups) {
          vm.allGroups = _.map(groups, function(group) {
            var groupName = AssignmentService.withoutRoot(group.values['Name']);
            return { label: groupName, group: groupName };
          });
          vm.allGroups.unshift({label: 'Unassign', group: ''});
        },
        function failure() {
          Toast.error('Failed to retrieve group information - assignment disabled.');
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
          //$state.go('queue.by.details.assignment', {}, {reload:true});
        }
      );
    }

  }
}());
