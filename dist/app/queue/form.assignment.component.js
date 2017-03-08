(function() {
  angular
    .module('kd.bundle.angular')
    .component('formAssignment', {
      templateUrl: 'queue/form.assignment.html',
      controller: ["md5", "$window", "$http", "$timeout", "$document", function(md5, $window, $http, $timeout, $document) {
        'ngInject';

        // Note: Get rid of this when moving to ES6 and replace promise functions with
        // fat arrow functions - it will clean the code up quite a bit.
        var self = this;

        this.isLoading = false;
        this.assigningTeam = false;
        this.assigningMember = false;
        this.allTeams = [];
        this.membersForTeam = [];

        this.isAssigningTeam = function() {
          return this.assigningTeam;
        };

        this.isAssigningMember = function() {
          return this.assigningMember;
        };

        this.startAssigningTeam = function() {
          if(this.isAssigningTeam()) {
            return;
          }

          this.isLoading = true;
          var teamsPath = $window.bundle.apiLocation() + '/teams';
          $http({
            method: 'GET',
            url: teamsPath,
            params: {
              include: 'attributes'
            }
          }).then(
            function success(response) {
              self.isLoading = false;
              var validTeams = _.filter(response.data.teams, function(team) {
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

              self.assigningTeam = true;
              self.allTeams = _.map(validTeams, function(team) {
                return { label: team.name, team: team.name };
              });
              self.allTeams.unshift({label: 'Unassign', team: ''});

              $timeout(function() {
                document.getElementById('form-team-selector').focus();
              }, 100);
            }
          );
        };

        this.startAssigningMember = function() {
          if(this.isAssigningTeam()) {
            return;
          }

          var teamName = $window.K('field[Assigned Team]').value();

          if(_.isEmpty(teamName)) {
            this.startAssigningTeam();
            return;
          }

          var teamPath = $window.bundle.apiLocation() + '/teams/' + md5.createHash(teamName);
          $http({
            method: 'GET',
            url: teamPath,
            params: {
              include: 'memberships,memberships.user'
            }
          }).then(
            function success(response) {
              self.membersForTeam = _.map(response.data.team.memberships, function(membership) {
                return membership.user;
              });
              self.membersForTeam.unshift({username: '', displayName: 'Unassigned'});
              self.assigningMember = true;

              $timeout(function() {
                document.getElementById('form-member-selector').focus();
              }, 100);
            }
          );
        };


        this.stopAssigningTeam = function() {
          this.assigningTeam = false;
        };

        this.stopAssigningMember = function() {
          this.assingingMember = false;
        };

        this.selectTeam = function(team) {
          $window.K('field[Assigned Team]').value(team.team);
          $window.K('field[Assigned Individual]').value('');

          this.assigningTeam = false;
        };

        this.selectMember = function(member) {
          $window.K('field[Assigned Individual]').value(member.username);
          this.assigningMember = false;
        };

        this.canEdit = function() {
          return !$window.K('form').reviewMode();
        };

        this.assignedTeamName = function() {
          var name = $window.K('field[Assigned Team]').value();
          return _.isEmpty(name) ? 'Unassigned' : name;
        };

        this.assignedIndividualName = function() {
          var name = $window.K('field[Assigned Individual]').value();
          return _.isEmpty(name) ? 'Unassigned' : name;
        };
      }]
    });
})();