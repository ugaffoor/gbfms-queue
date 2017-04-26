import angular from 'angular';
import formAssignmentTpl from './form.assignment.jade';

angular
  .module('kd.bundle.angular')
  .component('formAssignment', {
    templateUrl: formAssignmentTpl,
    controller: function(md5, $window, $http, $timeout, $document, $element) {
      'ngInject';

      // Note: Get rid of this when moving to ES6 and replace promise functions with
      // fat arrow functions - it will clean the code up quite a bit.
      var self = this;

      this.isLoading = false;
      this.assigningTeam = false;
      this.assigningMember = false;
      this.allTeams = [];
      this.membersForTeam = [];

      // Build up our 'K' object by getting the underlying form object.
      // Fetch the nearest parent form.
      var form = $($element).closest('[data-form]');
      // Fetch the form hash.
      var formHash = form.attr('id');
      // Set K to be the form select method.
      this.K = $window.Kinetic.forms[formHash].select;

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

        var teamName = this.K('field[Assigned Team]').value();

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
        this.K('field[Assigned Team]').value(team.team);
        this.K('field[Assigned Individual]').value('');
        this.K('field[Assigned Individual Display Name]').value('');

        this.assigningTeam = false;
      };

      this.selectMember = function(member) {
        this.K('field[Assigned Individual]').value(member.username);
        this.K('field[Assigned Individual Display Name]').value(member.displayName);
        this.assigningMember = false;
      };

      this.canEdit = function() {
        if(this.hasValidForm()) {
          return !this.K('form').reviewMode();
        }

        return false;
      };

      this.hasValidForm = function() {
        return this.K('form') instanceof KD.Form
      }

      this.assignedTeamName = function() {
        var name = '';
        if(this.hasValidForm()) {
          var field = this.K('field[Assigned Team]');
          name = field ? field.value() : '';
        }
        return _.isEmpty(name) ? 'Unassigned' : name;
      };

      this.assignedIndividualName = function() {
        var name = '';
        if(this.hasValidForm()) {
          var username = this.K('field[Assigned Individual]');
          var displayName = this.K('field[Assigned Individual Display Name]');
          if(displayName && !_.isEmpty(displayName.value())) {
            name = displayName.value();
          } else {
            name = username ? username.value() : '';
          }
        }
        return _.isEmpty(name) ? 'Unassigned' : name;
      };
    }
  });
