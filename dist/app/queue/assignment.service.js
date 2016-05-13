(function() {
  'use strict';

  AssignmentService.$inject = ["Submission", "$q"];
  angular
    .module('kd.bundle.angular.queue')
    .service('AssignmentService', AssignmentService);

  /* @ngInject */
  function AssignmentService(Submission, $q) {
    var service = {
      // Actions
      grabIt: grabIt,

      // Helpers
      getGroups: getGroups,
      getMembers: getMembers
    };
    return service;

    // var helperSubmissionsBase = $window.KD.base + '/' + kappSlug + '/' + form.slug;

    function grabIt(helper, currentUser, currentGroup, item) {
      var deferred = $q.defer();

      // First we need to determine if the current user is a member of the currently
      // assigned group in order for them to "grab it".
      getMembers(helper, currentGroup).then(
        function(members) {
          var association = _.find(members, function(member) {
            if(member.values['Object 1 Type'] === 'Group' &&
               member.values['Object 1 Id'] === currentGroup &&
               member.values['Object 2 Type'] === 'User' &&
               member.values['Object 2 Id'] === currentUser) {
              return true;
            } else if(member.values['Object 1 Type'] === 'User' &&
               member.values['Object 1 Id'] === currentUser &&
               member.values['Object 2 Type'] === 'Group' &&
               member.values['Object 2 Id'] === currentGroup) {
              return true;
            }
            return false;
          });

          // Check to see if the user we're assigning had an association
          // with the currently assigned group.
          if(typeof association !== 'undefined') {
            item.values['Assigned Individual'] = currentUser;
            item.values['Assigned Individual Display Name'] = currentUser;

            // We get currentPage in a different format than the server and we
            // don't actually care about sending it since we don't want to change
            // what page we're on. So just remove it.
            delete item.currentPage;

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
            deferred.reject('Current user is not a member of the currently assigned group.');
          }

        },
        function() {
          deferred.reject('Failed to retrieve associations.');
        }
      );


      return deferred.promise;
    }

    function getGroups(helper, parent) {
      if(typeof parent === 'undefined') {
        parent = 'root';
      }

      return Submission.search(helper, 'group')
        .eq('values[Parent]', parent)
        .coreState('Draft')
        .include('values')
        .execute();

    }

    /*
    coreState=Draft&include=values&q=(+(+values%5BObject+1+Type%5D+%3D+%22Group%22+AND+values%5BObject+1+Id%5D+%3D+%22US::IT%22)+OR+(+values%5BObject+2+Type%5D+%3D+%22Group%22+AND+values%5BObject+2+Id%5D+%3D+%22US::IT%22))
     */

    function getMembers(helper, group) {
      if(typeof parent === 'undefined') {
        parent = 'root';
      }

      return Submission.search(helper, 'association')
        .or()
          .and()
            .eq('values[Object 1 Type]', 'Group')
            .eq('values[Object 1 Id]', group)
            .end()
          .and()
            .eq('values[Object 2 Type]', 'Group')
            .eq('values[Object 2 Id]', group)
            .end()
          .end()
        .coreState('Draft')
        .include('values')
        .execute();

    }
  }
}());