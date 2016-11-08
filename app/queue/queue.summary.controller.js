(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueSummaryController', QueueSummaryController);

  /* @ngInject */
  function QueueSummaryController(item, subtasks, AssignmentService, Bundle, Toast, $scope, $state, $timeout) {
    var vm = this;
    var layout = $scope.layout;
    var details = $scope.details;

    // MEMBERS
    vm.item = item;
    vm.isAssigningGroup = false;
    vm.isAssigningMember = false;
    vm.isLoading = false;
    vm.membersForGroup = [];
    vm.subtasks = subtasks;
    vm.selectedSubtask = null;
    vm.addingSubtask = false;
    vm.workingIt = false;

    // METHODS
    vm.grabIt = grabIt;
    vm.startMemberAssignment = startMemberAssignment;
    vm.stopMemberAssignment = stopMemberAssignment;
    vm.memberSelected = memberSelected;
    vm.startGroupAssignment = startGroupAssignment;
    vm.stopGroupAssignment = stopGroupAssignment;
    vm.groupSelected = groupSelected;
    vm.selectSubtask = selectSubtask;
    vm.toggleAddingSubtask = toggleAddingSubtask;
    vm.toggleWorkingIt = toggleWorkingIt;

    activate();

    function activate() {
      
    }

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
      vm.item.values['Assigned Individual'] = member;
      vm.item.values['Assigned Individual Display Name'] = member;

      vm.item.put().then(
        function success() {
          Toast.success("Changed assigned individual!");
          vm.isLoading = false;
          vm.isAssigningMember = false;
          $state.go('.', {}, {reload:true});
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

    function selectSubtask(subtask) {
      vm.selectedSubtask = subtask;
      var itemPath = Bundle.kappLocation() + '/' + subtask.slug;

      K.reset();
      K.load({
        container: '#subtaskContainer',
        parentId: vm.item.id,
        originId: (vm.item.origin !== null ? vm.item.origin.id : vm.item.id),
        path: itemPath,
        loaded: function() {
          $timeout(function() {
            vm.isLoading = false;
          });
        },
        completed: function() {
          $timeout(function() {
            Toast.success('Completed item!');
            $state.go('queue.by.details.summary', {}, {reload:true});
          }, 3000);
        },
        created: updateParent,
        updated: updateParent
      });

      function updateParent() {
        Toast.success('Added subtask.');
        $state.go('queue.by.details.summary', {}, {reload:true});
      }
    }

    function toggleAddingSubtask() {
      vm.addingSubtask = !vm.addingSubtask;
      if(!vm.addingSubtask) {
        vm.selectedSubtask = null;
        K.reset();
      }
    }

    function toggleWorkingIt() {
      vm.workingIt = !vm.workingIt;
      if(vm.workingIt && details.isMine()) {
        var itemPath = Bundle.spaceLocation() + '/submissions/' + vm.item.id;

        if(vm.item.coreState === 'Closed' || vm.item.coreState === 'Submitted') {
          itemPath += '?review';
        }

        $timeout(function() {
          K.reset();
          K.load({
            container: '#workContainer',
            path: itemPath,
            loaded: function() {
              $timeout(function() {
                vm.isLoading = false;
              });
            },
            completed: function() {
              $timeout(function() {
                Toast.success('Completed item!');
                $state.go('queue.by', {}, {reload:true});
              }, 3000);
            },
            updated: function() {
              $timeout(function() {
                Toast.success('Updated item.');
                $state.go('.', {}, {reload:true});
              });
            }
          }, 50);
        });
      } else {
        K.reset();
      }
    }

  }
}());
