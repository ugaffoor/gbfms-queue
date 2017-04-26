import angular from 'angular';

angular
  .module('kd.bundle.angular.queue')
  .service('ItemsService', ItemsService);

/* @ngInject */
function ItemsService(Submission) {
  var activeStatuses = [];
  var inactiveStatuses = [];

  var service = {
    filter: filter,
    setActiveStatuses: setActiveStatuses,
    setInactiveStatuses: setInactiveStatuses
  };

  return service;

  function filter(kappSlug, user, itemFilter, pageToken) {
    var searcher =  Submission.search(kappSlug);

    if(itemFilter.filterOptions && (itemFilter.filterOptions.stateActive || itemFilter.filterOptions.stateInactive) && (activeStatuses.length > 0 || inactiveStatuses.length > 0)) {
      searcher.or();
      if(itemFilter.filterOptions.stateActive) {
        _.each(activeStatuses, function(status) {
          searcher.eq('values[Status]', status)
        });
      }

      if(itemFilter.filterOptions.stateInactive) {
        _.each(inactiveStatuses, function(status) {
          searcher.eq('values[Status]', status);
        });
      }
      searcher.end();
    }

    _.each(itemFilter.qualifications, function(qualification) {
      if(qualification.value === '${myGroups}') {
        var groups = _.map(
          _.filter(user.memberships, function(membership) {
            var assignable = _.find(membership.team.attributes, {name: 'Assignable'});
            if(assignable && ['TRUE', 'YES'].indexOf(assignable.values[0].toUpperCase()) !== -1) {
              return true;
            }
            return false;
          }),
          function(membership) {
            return membership.team.name;
          }
        );

        if(groups.length > 0) {
          searcher.or();
          _.each(groups, function(group) {
            searcher.eq(qualification.field, group);
          });
          searcher.end();
        }
      } else {
        var rval = qualification.value;
        var lval = qualification.field;

        if(qualification.value === '${me}') {
          rval = user.username;
        }

        if(_.startsWith(lval, 'values')) {
          searcher.eq(lval, rval);
        } else if(lval === 'type') {
          searcher.type(rval);
        }

      }

    });

    if(!_.isEmpty(pageToken)) {
      searcher.pageToken(pageToken);
    }

    if(itemFilter.startDate instanceof Date) {
      searcher.startDate(itemFilter.startDate);
    }

    if(itemFilter.endDate instanceof Date) {
      searcher.endDate(itemFilter.endDate);
    }

    var sortBy = 'updatedAt';
    var sortDir = 'DESC';
    if(itemFilter.filterOptions && itemFilter.filterOptions.sortBy === 'created') {
      sortBy = 'createdAt';
    }

    if(itemFilter.filterOptions && !_.isEmpty(itemFilter.filterOptions.sortDir)) {
      sortDir = itemFilter.filterOptions.sortDir.toUpperCase();
    }

    if(itemFilter.filterOptions.closedToday) {
      searcher.coreState('Closed');
      var today = new Date();
      var yesterday = new Date(new Date().setDate(today.getDate()-1));
      searcher.startDate(yesterday);
      searcher.endDate(today);
    }

    return searcher
      .sortBy(sortBy)
      .sortDirection(sortDir)
      .limit(1000)
      .includes(['values,details,form,form.attributes'])
      .execute().then(
        function(items) {
          // Filter out items based on assignment flags.
          items = _.filter(items, function(item) {
            // If any of these is true.
            var assignedToNone = itemFilter.filterOptions &&
                                  itemFilter.filterOptions.assignmentNone &&
                                  _.isEmpty(item.values['Assigned Individual']);
            var assignedToMe   = itemFilter.filterOptions &&
                                  itemFilter.filterOptions.assignmentMine &&
                                  item.values['Assigned Individual'] === user.username;
            var assignedToOther = itemFilter.filterOptions &&
                                  itemFilter.filterOptions.assignmentOthers &&
                                  !_.isEmpty(item.values['Assigned Individual']) &&
                                  item.values['Assigned Individual'] !== user.username;
            var noneChecked = itemFilter.filterOptions &&
                              !itemFilter.filterOptions.assignmentNone &&
                              !itemFilter.filterOptions.assignmentMine &&
                              !itemFilter.filterOptions.assignmentOthers;
            return assignedToNone || assignedToMe || assignedToOther || noneChecked;
          });

          // Sort by due date, if applicable.
          if(itemFilter.filterOptions && itemFilter.filterOptions.sortBy === 'due') {
            items.sort(function(a, b) {
              var dateA = a.values['Due Date'] === null ? moment.unix(0) : moment(a.values['Due Date']);
              var dateB = b.values['Due Date'] === null ? moment.unix(0) : moment(b.values['Due Date']);
              if(dateA.isSame(dateB)) {
                return 0;
              } else if(dateA.isAfter(dateB)) {
                return itemFilter.filterOptions.sortDir === 'desc' ? -1 : 1;
              } else {
                return itemFilter.filterOptions.sortDir === 'desc' ? 1 : -1;
              }
            });
          }
          return items;
        }
      );
  }

  function setActiveStatuses(statuses) {
    activeStatuses = statuses;
  }

  function setInactiveStatuses(statuses) {
    inactiveStatuses = statuses;
  }
}
