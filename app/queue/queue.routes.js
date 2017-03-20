(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('queue', {
      parent: 'protected',
      url: '/queue',

      resolve: {
        titleBrand: function(spaceConfigResolver) {
          var pageTitlePrefixAttribute = spaceConfigResolver('Page Title Prefix', false);
          if(typeof pageTitlePrefixAttribute !== 'undefined') {
            return pageTitlePrefixAttribute.values[0];
          }
          return 'Kinetic Data';
        },
        titleCompany: function(spaceConfigResolver) {
          var companyNameAttribute = spaceConfigResolver('Company Name', false);
          if(typeof companyNameAttribute !== 'undefined') {
            return companyNameAttribute.values[0];
          }
          return '';
        },
        queueName: function(kappConfigResolver) {
          var queueNameAttribute = kappConfigResolver('Queue Name');
          return queueNameAttribute.values[0];
        },
        queueCompletedValue: function(kappConfigResolver) {
          var queueNameAttribute = kappConfigResolver('Queue Completed Value');
          return queueNameAttribute.values[0];
        },
        queueSetupVisible: function(kappConfigResolver) {
          var queueSetupVisibleAttribute = kappConfigResolver('Queue Setup Visible');
          return queueSetupVisibleAttribute.values[0];
        },
        queueDetailsValue: function(kappConfigResolver) {
          var queueDetailsAttribute = kappConfigResolver('Queue Details Value');
          return queueDetailsAttribute.values[0];
        },
        queueSummaryValue: function(kappConfigResolver) {
          var queueSummaryAttribute = kappConfigResolver('Queue Summary Value');
          return queueSummaryAttribute.values[0];
        },
        queueGroupBase: function(kappConfigResolver, AssignmentService) {
          var queueGroupBase = kappConfigResolver('Queue Group Base', false);
          var groupBaseValue = angular.isDefined(queueGroupBase) ? queueGroupBase.values[0] : '';
          AssignmentService.setAssignmentBase(groupBaseValue);
          return groupBaseValue;
        },
        queueDiscussionServer: function(spaceConfigResolver) {
          var queueDiscussionServer = spaceConfigResolver('Discussion Server Url', false);
          if(angular.isUndefined(queueDiscussionServer)) {
            return '';
          }
          return queueDiscussionServer.values[0];
        },
        adminKapp: function(spaceConfigResolver, AssignmentService) {
          var adminKapp = spaceConfigResolver('Admin Kapp Slug');
          AssignmentService.setAdminKapp(adminKapp.values[0]);
          return adminKapp.values[0];
        },
        teamsKapp: function(spaceConfigResolver) {
          var teamsKapp = spaceConfigResolver('Teams Kapp Slug', false);
          if(angular.isUndefined(teamsKapp)) {
            return '';
          }
          return teamsKapp.values[0];
        },
        filters: function(kappConfigResolver, currentUser) {
          var filters = [
            {
              name: 'Mine',
              qualifications: [
                {
                  field: 'values[Assigned Individual]',
                  value: '${me}'
                }
              ],
              visible: true
            }
          ];

          var teamOrder = 0;
          var validMemberships = _.filter(currentUser.memberships, function(membership) {
            // Find the Assignable attribute.
            var assignable = _.find(membership.team.attributes, function(attribute) {
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

          var teams = _.map(validMemberships, function(membership) {
            return membership.team.name;
          });

          _.each(teams, function(team) {
            var teamFilter = {
              name: team,
              order: teamOrder,
              qualifications: [
                {
                  field: 'values[Assigned Team]',
                  value: team
                }
              ],
              visible: true
            };
            filters.push(teamFilter);
            teamOrder++;
          });

          if(currentUser.spaceAdmin) {
            filters.push({
              name: 'All',
              order: filters.length,
              qualifications: [],
              visible: true
            });
          }

          filters.push({
            name: '__show__',
            order: filters.length,
            qualifications: [],
            visible: false
          });

          return filters;

        },
        forms: function(currentKapp, Form) {
          return Form.build(currentKapp.slug).getList({include:'details,attributes'});
        },
        teams: function(AssignmentService) {
          return AssignmentService.getAllTeams();
        }
      },

      views: {
        '': {
          templateUrl: 'queue/queue.tpl.html',
          controller: 'QueueController as queue'
        }
      }
    });

    $stateProvider.state('queue.by', {
      url: '/filter/{filterName}/{filterType}',
      views: {
        '': {
          controller: 'QueueListController as list',
          templateUrl: 'queue/queue.list.tpl.html',
          resolve: {
            filterName: function($stateParams, filters) {
              var filterName = $stateParams.filterName;
              if(filterName === '__default__') {
                filterName = filters[0].name;
              }
              return filterName;
            },
            filterType: function($stateParams, filters) {
              return $stateParams.filterType;
            },
            filter: function(filters, filterName) {
              return _.find(filters, {name: filterName});
            },
            openItems: function(Submission, ItemsService, currentKapp, currentUser, filter, $q) {
              if(filter.name === '__show__') {
                return $q.resolve([]);
              }
              var openQualification = {
                field: 'values[Status]',
                value: '${openStatuses}'
              };
              var effectiveFilter = _.cloneDeep(filter);
              effectiveFilter.qualifications.push(openQualification);

              return ItemsService.filter(currentKapp.slug, currentUser, effectiveFilter);
            },
            items: function($q, Submission, ItemsService, currentKapp, currentUser, filter, filterType, openItems) {
              var startDate = new Date();
              var endDate = new Date();

              // If the filter type is 'Open' we already calculate the open items and retrieved them.
              if(filterType === 'Open') {
                return $q.resolve(openItems);
              }

              // If the filter type is 'Mine' then filter down to just the ones assigned to the current user.
              if(filterType === 'Mine') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    return item.values['Assigned Individual'] === currentUser.username;
                  })
                );
              }

              // If the filter type is 'Pending' then filter down to just the pending issues.
              if(filterType === 'Pending') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    return item.values['Status'] === 'Pending';
                  })
                );
              }

              if(filterType === 'In Progress') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    return item.values['Status'] === 'In Progress';
                  })
                );
              }

              // If the filter type is 'Unassigned' then filte down to just the ones where the assigned individual is empty.
              if(filterType === 'Unassigned') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    return _.isEmpty(item.values['Assigned Individual']);
                  })
                );
              }

              var today = moment();
              if(filterType === 'Past Due') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    var dueDate = moment(item.values['Due Date']);
                    if(!dueDate.isValid()) return false;

                    return dueDate.isBefore(today.startOf('day'));
                  })
                );
              }

              if(filterType === 'Due Today') {
                return $q.resolve(
                  _.filter(openItems, function(item) {
                    var dueDate = moment(item.values['Due Date']);
                    if(!dueDate.isValid()) return false;
                    return dueDate.isSame(today.startOf('day'), 'd');
                  })
                );
              }

              // If it is not open then assume it is time-boxed.
              if(filterType === 'Recent Hour') {
                startDate.setHours(startDate.getHours() - 2);
              } else {
                startDate.setHours(startDate.getHours() - 24);
              }

              var effectiveFilter = _.cloneDeep(filter);
              effectiveFilter.startDate = startDate;
              effectiveFilter.endDate = endDate;

              // TODO use the filterType here.
              return ItemsService.filter(currentKapp.slug, currentUser, effectiveFilter);
            }
          }
        }
      }
    });

    $stateProvider.state('queue.by.details', {
      url: '/details/{itemId}',
      resolve: {
        itemId: function($stateParams) {
          return $stateParams.itemId;
        },
        item: function(Submission, currentKapp, itemId) {
          return Submission.build().one(itemId).get({include:'details,form,form.attributes,values,origin,origin.form,origin.form.kapp,parent,parent.values,parent.details,parent.form,parent.form.attributes,children,children.details,children.form,children.form.attributes,children.values'}).then(
            function success(submission) {
              return submission;
            }
          );
        }
      },

      views: {
        '': {
          controller: 'QueueDetailController as details',
          templateUrl: 'queue/queue.detail.tpl.html'
        }
      }
    });

    $stateProvider.state('queue.by.details.discuss', {
      url: '/discuss',
      views: {
        '': {
          controller: 'QueueDiscussionController as vm',
          templateUrl: 'queue/queue.discuss.tpl.html'
        }
      }
    });

    $stateProvider.state('queue.by.details.summary', {
      url: '/summary',

      views: {
        '': {
          controller: 'QueueSummaryController as vm',
          templateUrl: 'queue/queue.summary.tpl.html',
          resolve: {
            subtasks: function(item, forms, $q) {
              // Reduce the list of potential forms to just ones that are of a type 'Subtask' and active.
              var subtasks = _.filter(forms, {
                status: 'Active',
                type: 'Subtask'
              });

              // Check to see if this item has been configured to specify subtasks. If it is listing permitted
              // subtasks we will need to take the master list of subtasks and filter it down to the ones that
              // are allowed on this item.
              var permittedSubtasksAttribute = _.find(item.form.attributes, {name: 'Permitted Subtasks'});
              if(typeof permittedSubtasksAttribute !== 'undefined') {
                var permittedSubtasks = permittedSubtasksAttribute.values;
                subtasks = _.filter(subtasks, function(subtask) {
                  return permittedSubtasks.indexOf(subtask.slug) > -1;
                });
              }
              return $q.resolve(subtasks);
            },
            notes: function(item) {
              return _.filter(item.children, function(child) {
                return (child.form.slug === 'note');
              });
            },
            relatedItems: function(item) {
              return _.filter(item.children, function(child) {
                return (child.form.slug !== 'note');
              });
            }
          }
        }
      }
    });

    $stateProvider.state('queue.by.details.summary.work', {
      url: '/work',

      views: {
        '': {
          controller: 'QueueWorkController as vm',
          templateUrl: 'queue/queue.work.tpl.html'
        }
      }
    });

    $stateProvider.state('queue.by.details.summary.task', {
      url: '/add-task/{subtaskSlug}',

      views: {
        '': {
          controller: 'QueueSubtaskController as vm',
          templateUrl: 'queue/queue.subtask.tpl.html',
          resolve: {
            subtaskSlug: function($stateParams) {
              return $stateParams.subtaskSlug;
            },
            subtask: function(currentKapp, subtaskSlug, Form) {
              return Form.build(currentKapp.slug).one(subtaskSlug).get();
            }
          }
        }
      }
    });

    $stateProvider.state('queue.create', {
      url: '/create',
      views: {
        '': {
          templateUrl: 'queue/queue.new.list.tpl.html',
          controller: 'QueueNewListController as createList'
        }
      }
    });

    $stateProvider.state('queue.create.team', {
      url: '/{activeTeam}',
      views: {
        '': {
          templateUrl: 'queue/queue.new.item.tpl.html',
          controller: 'QueueNewItemController as vm',
          resolve: {
            activeTeam: function($stateParams) {
              return $stateParams.activeTeam;
            },
            formsByTeam: function(activeTeam, forms) {
              return _.filter(forms, function(form) {
                var serviceOwnerTeam = _.find(form.attributes, {name: 'Service Owner Team'});
                return angular.isDefined(serviceOwnerTeam) ? serviceOwnerTeam.values.indexOf(activeTeam) !== -1 : false;
              });
            }
          }
        }
      }
    });
  };
}());
