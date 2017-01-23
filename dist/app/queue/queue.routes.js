(function() {
  'use strict';

  routes.$inject = ["$stateProvider"];
  angular
    .module('kd.bundle.angular.queue')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('queue', {
      parent: 'protected',
      url: '/queue',

      resolve: {
        titleBrand: ["spaceConfigResolver", function(spaceConfigResolver) {
          var pageTitlePrefixAttribute = spaceConfigResolver('Page Title Prefix', false);
          if(typeof pageTitlePrefixAttribute !== 'undefined') {
            return pageTitlePrefixAttribute.values[0];
          }
          return 'Kinetic Data';
        }],
        titleCompany: ["spaceConfigResolver", function(spaceConfigResolver) {
          var companyNameAttribute = spaceConfigResolver('Company Name', false);
          if(typeof companyNameAttribute !== 'undefined') {
            return companyNameAttribute.values[0];
          }
          return '';
        }],
        queueName: ["kappConfigResolver", function(kappConfigResolver) {
          var queueNameAttribute = kappConfigResolver('Queue Name');
          return queueNameAttribute.values[0];
        }],
        queueCompletedValue: ["kappConfigResolver", function(kappConfigResolver) {
          var queueNameAttribute = kappConfigResolver('Queue Completed Value');
          return queueNameAttribute.values[0];
        }],
        queueSetupVisible: ["kappConfigResolver", function(kappConfigResolver) {
          var queueSetupVisibleAttribute = kappConfigResolver('Queue Setup Visible');
          return queueSetupVisibleAttribute.values[0];
        }],
        queueDetailsValue: ["kappConfigResolver", function(kappConfigResolver) {
          var queueDetailsAttribute = kappConfigResolver('Queue Details Value');
          return queueDetailsAttribute.values[0];
        }],
        queueSummaryValue: ["kappConfigResolver", function(kappConfigResolver) {
          var queueSummaryAttribute = kappConfigResolver('Queue Summary Value');
          return queueSummaryAttribute.values[0];
        }],
        queueGroupBase: ["kappConfigResolver", "AssignmentService", function(kappConfigResolver, AssignmentService) {
          var queueGroupBase = kappConfigResolver('Queue Group Base', false);
          AssignmentService.setAssignmentBase(queueGroupBase.values[0]);
          return queueGroupBase.values[0];
        }],
        queueResponseServer: ["kappConfigResolver", function(kappConfigResolver) {
          var queueResponseServer = kappConfigResolver('Queue Response Server', false);
          if(angular.isUndefined(queueResponseServer)) {
            return '';
          }
          return queueResponseServer.values[0];
        }],
        adminKapp: ["spaceConfigResolver", "AssignmentService", function(spaceConfigResolver, AssignmentService) {
          var adminKapp = spaceConfigResolver('Admin Kapp Slug');
          AssignmentService.setAdminKapp(adminKapp.values[0]);
          return adminKapp.values[0];
        }],
        filters: ["kappConfigResolver", "currentUser", function(kappConfigResolver, currentUser) {
          // Fetch the attribute
          var queueFilterAttribute = kappConfigResolver('Queue Filters');
          // If it's not defined we want it to work as if there are no filters.
          if(typeof queueFilterAttribute === 'undefined') {
            queueFilterAttribute = {
              name: 'Queue Filters',
              values: []
            };
          }

          queueFilterAttribute.values = _.map(queueFilterAttribute.values, function(filter) {
            if(typeof filter === 'string') {
                return JSON.parse(filter);
            }
            return filter;
          });

          queueFilterAttribute.values = _.sortBy(queueFilterAttribute.values, 'order');

          var filters = _.cloneDeep(queueFilterAttribute.values);
          var groupAttribute = _.find(currentUser.attributes, {name: 'Group'});
          var groupOrder = filters.length;
          if(groupAttribute) {
            _.each(groupAttribute.values, function(group) {
              var groupFilter = {
                name: group,
                order: groupOrder,
                qualifications: [
                  {
                    field: 'values[Status]',
                    value: '${openStatuses}'
                  },
                  {
                    field: 'values[Assigned Group]',
                    value: group
                  }
                ]
              };
              filters.push(groupFilter);
              groupOrder++;
            });
          }

          if(currentUser.spaceAdmin) {
            filters.push({
              name: 'All',
              order: filters.length,
              qualifications: [
              ]
            });
          }
          return filters;
        }],
        forms: ["currentKapp", "Form", function(currentKapp, Form) {
          return Form.build(currentKapp.slug).getList({include:'details,attributes'});
        }]
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
      views: {
        '': {
          controller: 'QueueListController as list',
          templateUrl: 'queue/queue.list.tpl.html',
          resolve: {
            filterName: ["$stateParams", "filters", function($stateParams, filters) {
              var filterName = $stateParams.filterName;
              if(filterName === '__default__') {
                filterName = filters[0].name;
              }
              return filterName;
            }],
            filter: ["filters", "filterName", function(filters, filterName) {
              return _.find(filters, {name: filterName});
            }],
            items: ["Submission", "ItemsService", "currentKapp", "currentUser", "filter", function(Submission, ItemsService, currentKapp, currentUser, filter) {
              return ItemsService.filter(currentKapp.slug, currentUser, filter);
            }]
          }
        }
      }
    });

    $stateProvider.state('queue.by.details', {
      url: '/details/{itemId}',
      resolve: {
        itemId: ["$stateParams", function($stateParams) {
          return $stateParams.itemId;
        }],
        item: ["Submission", "currentKapp", "itemId", function(Submission, currentKapp, itemId) {
          return Submission.build().one(itemId).get({include:'details,form,form.attributes,values,origin,parent,parent.values,parent.details,parent.form,parent.form.attributes,children,children.details,children.form,children.form.attributes,children.values'}).then(
            function success(submission) {
              return submission;
            }
          );
        }]
      },

      views: {
        '': {
          controller: 'QueueDetailController as details',
          templateUrl: 'queue/queue.detail.tpl.html'
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
            subtasks: ["item", "forms", "$q", function(item, forms, $q) {
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
            }],
            notes: ["item", function(item) {
              return _.filter(item.children, function(child) {
                return (child.form.slug === 'note');
              });
            }],
            relatedItems: ["item", function(item) {
              return _.filter(item.children, function(child) {
                return (child.form.slug !== 'note');
              });
            }]
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
            subtaskSlug: ["$stateParams", function($stateParams) {
              return $stateParams.subtaskSlug;
            }],
            subtask: ["currentKapp", "subtaskSlug", "Form", function(currentKapp, subtaskSlug, Form) {
              return Form.build(currentKapp.slug).one(subtaskSlug).get();
            }]
          }
        }
      }
    });

    $stateProvider.state('queue.create', {
      url: '/create',
      views: {
        '': {
          templateUrl: 'queue/queue.new.item.tpl.html',
          controller: 'QueueNewItemController as vm'
        }
      }
    });
  }
}());
