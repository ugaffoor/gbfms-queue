(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .service('AssignmentService', AssignmentService);

  /* @ngInject */
  function AssignmentService(TeamModel, Submission, md5, $q) {
    var service = {
      // Actions
      grabIt: grabIt,

      // Helpers
      getTeams: getTeams,
      getAllTeams: getAllTeams,
      getMembers: getMembers,
      getAssignedTeams: getAssignedTeams,
      isTeamLeaf: isTeamLeaf,
      withoutRoot: withoutRoot,
      withRoot: withRoot,
      setAdminKapp: setAdminKapp,
      setAssignmentBase: setAssignmentBase
    };

    var adminKapp = null;
    var rootTeam = null;

    return service;

    function setAdminKapp(adminKappSlug) {
      adminKapp = adminKappSlug;
    }

    function setAssignmentBase(assignmentBaseTeam) {
      rootTeam = assignmentBaseTeam;
    }

    function withoutRoot(team) {
      if(_.isEmpty(rootTeam)) return team;

      if(_.startsWith(team, rootTeam + '::')) {
        return team.slice(rootTeam.length + 2);
      } else if(team === rootTeam) {
        return '';
      } else {
        return team;
      }
    }

    function withRoot(team) {
      if(_.isEmpty(rootTeam)) return team;

      var teamWithRoot = team;
      if(!_.startsWith(team, rootTeam)) {
        if(_.isEmpty(team)) {
          teamWithRoot = rootTeam;
        } else {
          teamWithRoot = rootTeam + '::' + team;
        }
      }

      return teamWithRoot;
    }

    function getAssignedTeams(item) {
      var team = withoutRoot(item.values['Assigned Team']);
      var teams = [];
      if(!_.isEmpty(team)) {
        teams = team.split('::');
      }

      return teams;
    }

    function isTeamLeaf(item) {
      var deferred = $q.defer();
      getTeams(withRoot(item.values['Assigned Team'])).then(
        function(teams) {
          if(teams.length < 1) {
            //vm.state.showMembersButton = _.isEmpty(vm.memberId);
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }, function() {
          deferred.reject();
        }
      );

      return deferred.promise;
    }

    function grabIt(currentUser, currentTeam, item) {
      var deferred = $q.defer();

      // First we need to determine if the current user is a member of the currently
      // assigned team in order for them to "grab it".
      getMembers(currentTeam).then(
        function(members) {
          var membership = _.find(members, function(member) {
            return member.username === currentUser;
            // if(member.values['Team Name'] === withRoot(currentTeam) &&
            //    member.values['Username'] === currentUser) {
            //   return true;
            // }
            // return false;
          });

          // Check to see if the user we're assigning had an association
          // with the currently assigned team.
          if(typeof membership !== 'undefined') {
            item.values['Assigned Individual'] = membership.username;
            item.values['Assigned Individual Display Name'] = membership.displayName;

            // We get currentPage in a different format than the server and we
            // don't actually care about sending it since we don't want to change
            // what page we're on. So just remove it.
            delete item.currentPage;
            // Even though we're not actually changing the coreState the server will
            // not allow individuals who are not space admins to send this property.
            delete item.coreState;

            // Save the submission with the new assignment information.
            item.put().then(
              function() {
                deferred.resolve('Successfully grabbed item.');
              },
              function() {
                deferred.reject('Failed to save assignment.');
              }
            );
          } else {
            deferred.reject('Current user is not a member of the currently assigned team.');
          }

        },
        function() {
          deferred.reject('Failed to retrieve associations.');
        }
      );


      return deferred.promise;
    }

    function getAllTeams() {
      return TeamModel.build().getList({include: 'attributes'}).then(
        function success(teams) {
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
          return validTeams;
        }
      );
    }

    function getTeams(parent) {
      parent = withRoot(parent);

      return Submission.search(adminKapp, 'team')
        .eq('values[Parent]', parent)
        .coreState('Draft')
        .include('values')
        .execute();

    }

    function getMembers(team) {
      team = withRoot(team);

      return TeamModel
        .build()
        .one(md5.createHash(team))
        .get({include:'memberships,memberships.user'})
        .then(function(team) {
          return _.map(team.memberships, function(membership) {
            return membership.user;
          });
        });
    }
  }
}());
