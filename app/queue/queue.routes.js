(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('queue', {
      parent: 'protected',
      url: '/queue?assignment&state&sortBy&sortDir&assignmentMine&assignmentNone&assignmentOthers&stateActive&stateInactive&closedToday',

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
        urlFilterOptions: function($stateParams) {
          var urlFilterOptions = {};
          if(angular.isDefined($stateParams.sortBy)) {
            urlFilterOptions.sortBy = $stateParams.sortBy;
          }

          if(angular.isDefined($stateParams.sortDir)) {
            urlFilterOptions.sortDir = $stateParams.sortDir;
          }

          if(angular.isDefined($stateParams.assignmentMine)) {
            urlFilterOptions.assignmentMine = $stateParams.assignmentMine === 'true' || false;
          }

          if(angular.isDefined($stateParams.assignmentOthers)) {
            urlFilterOptions.assignmentOthers = $stateParams.assignmentOthers  === 'true' || false;
          }

          if(angular.isDefined($stateParams.assignmentNone)) {
            urlFilterOptions.assignmentNone = $stateParams.assignmentNone === 'true' || false;
          }

          if(angular.isDefined($stateParams.stateActive)) {
            urlFilterOptions.stateActive = $stateParams.stateActive === 'true' || false;
          }

          if(angular.isDefined($stateParams.stateInactive)) {
            urlFilterOptions.stateInactive = $stateParams.stateInactive === 'true' || false;
          }

          if(angular.isDefined($stateParams.closedToday)) {
            urlFilterOptions.closedToday = $stateParams.closedToday === 'true' || false;
          }
          return urlFilterOptions;
        },
        filters: function(kappConfigResolver, currentUser) {
          var availableFilter = {
            name: 'Available',
            visible: true,
            qualifications: [
              {
                field: 'values[Assigned Team]',
                value: '${myGroups}'
              }
            ],
            defaultFilterOptions: {
              sortBy: 'updated',
              sortDir: 'desc',
              assignmentMine: false,
              assignmentOthers: false,
              assignmentNone: true,
              stateActive: true,
              stateInactive: false,
              closedToday: false
            },
            filterOptions: {}
          };

          var filters = [
            {
              name: 'Mine',
              visible: true,
              qualifications: [
                {
                  field: 'values[Assigned Individual]',
                  value: '${me}'
                }
              ],
              defaultFilterOptions: {
                sortBy: 'updated',
                sortDir: 'desc',
                assignmentMine: true,
                assignmentOthers: false,
                assignmentNone: false,
                stateActive: true,
                stateInactive: false,
                closedToday: false
              },
              filterOptions: {}
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

          if(teams.length > 0) {
            filters.unshift(availableFilter);
          }

          // TODO: sort teams alphabetically, omit order.
          _.each(teams, function(team) {
            var teamFilter = {
              name: team,
              visible: true,
              order: teamOrder,
              qualifications: [
                {
                  field: 'values[Assigned Team]',
                  value: team
                }
              ],
              defaultFilterOptions: {
                sortBy: 'updated',
                sortDir: 'desc',
                assignmentMine: true,
                assignmentOthers: false,
                assignmentNone: false,
                stateActive: true,
                stateInactive: false,
                closedToday: false
              },
              filterOptions: {}
            };
            filters.push(teamFilter);
            teamOrder++;
          });

          if(currentUser.spaceAdmin) {
            filters.push({
              name: 'All',
              visible: true,
              order: filters.length,
              qualifications: [],
              defaultFilterOptions: {
                sortBy: 'updated',
                sortDir: 'desc',
                assignmentMine: false,
                assignmentOthers: false,
                assignmentNone: false,
                stateActive: false,
                stateInactive: false,
                closedToday: false
              },
              filterOptions: {}
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
        },
        activeStatuses: function(currentSpace, currentKapp, $q) {
          var statuses = _.find(currentKapp.attributes, {name: 'Statuses - Active'});
          if(_.isEmpty(statuses)) {
            statuses = _.find(currentSpace.attributes, {name: 'Statuses - Active'});
          }

          if(_.isEmpty(statuses)) {
            statuses = ['Open', 'In Progress'];
          } else {
            statuses = statuses.values;
          }
          return $q.resolve(statuses);

        },
        inactiveStatuses: function(currentSpace, currentKapp, $q) {
          var statuses = _.find(currentKapp.attributes, {name: 'Statuses - Inactive'});
          if(_.isEmpty(statuses)) {
            statuses = _.find(currentSpace.attributes, {name: 'Statuses - Inactive'});
          }

          if(_.isEmpty(statuses)) {
            statuses = ['Pending'];
          } else {
            statuses = statuses.values;
          }
          return $q.resolve(statuses);
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
      url: '/filter/{filterName}',
      resolve: {
        filterName: function($stateParams, filters) {
          var filterName = $stateParams.filterName;
          if(filterName === '__default__') {
            filterName = filters[0].name;
          }
          return filterName;
        }
      },
      views: {
        '': {
          controller: 'QueueListController as list',
          templateUrl: 'queue/queue.list.tpl.html',
          resolve: {
            filter: function(filters, filterName, urlFilterOptions) {
              var filter = _.find(filters, {name: filterName});
              filter.filterOptions = _.merge({}, filter.defaultFilterOptions, urlFilterOptions);
              return filter;
            },
            items: function(ItemsService, currentKapp, currentUser, filter, activeStatuses, inactiveStatuses, $q) {
              // Handle the situation where we are showing an individual item.
              if(filter.name === '__show__') {
                return $q.resolve([]);
              }

              // We need to make sure that the active and inactive statuses are accurate before filtering.
              ItemsService.setActiveStatuses(activeStatuses);
              ItemsService.setInactiveStatuses(inactiveStatuses);

              return ItemsService.filter(currentKapp.slug, currentUser, filter);
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
            subtasks: function(currentUser, item, filterName, forms, $q) {
              var activeTeam = item.values['Assigned Team'];

              // Reduce the list of potential forms to just ones that are of a type 'Subtask' and active.
              var subtasks = _.filter(forms, function(form) {
                return form.status === 'Active' && (form.type === 'Subtask' || form.type === 'Task');
              });

              subtasks = _.filter(subtasks, function(form) {
                var owningTeam = _.find(form.attributes, {name: 'Owning Team'});
                var hasOwningTeam = angular.isDefined(owningTeam);
                // If Subtask and no owning team, then yes.
                if(!hasOwningTeam) {
                  return true;
                }
                // If Task or Subtask and owning team, only if it's contained.
                return owningTeam.values.indexOf(activeTeam) > -1;
              });

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
