(function() {
  'use strict';

  angular
    .module('kd.bundle.angular.queue')
    .config(routes);

  /* @ngInject */
  function routes($stateProvider) {
    $stateProvider.state('queue', {
      parent: 'default',
      url: '/queue',

      resolve: {
        configResolver: function(currentUser, currentKapp, $state) {
          return function(attributeKey) {
            var attribute = _.find(currentKapp.attributes, {name:attributeKey});
            if(_.isEmpty(attribute)) {
              if(currentUser.spaceAdmin) {
                $state.go('setup');
              } else {
                $state.go('error.setup');
              }
            } else {
              return attribute;
            }
          };
        },
        queueName: function(configResolver) {
          var queueNameAttribute = configResolver('Queue Name');
          return queueNameAttribute.values[0];
        },
        queueType: function(configResolver) {
          var queueTypeAttribute = configResolver('Queue Type');
          return queueTypeAttribute.values[0];
        },
        queueDetailsValue: function(configResolver) {
          var queueDetailsAttribute = configResolver('Queue Details Value');
          return queueDetailsAttribute.values[0];
        },
        helperKapp: function(configResolver) {
          var helperKappAttribute = configResolver('Helper Kapp Slug');
          return (helperKappAttribute !== undefined ? helperKappAttribute.values[0] : 'helper');
        },
        filters: function(currentKapp) {
          // Fetch the attribute
          var queueFilterAttribute = _.find(currentKapp.attributes, {name:'Queue Filters'});
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
          return queueFilterAttribute.values;
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
      views: {
        '': {
          controller: 'QueueListController as vm',
          templateUrl: 'queue/queue.list.tpl.html',
          resolve: {
            filterName: function($stateParams, filters) {
              var filterName = $stateParams.filterName;
              if(filterName === '__default__') {
                filterName = filters[0].name;
              }
              return filterName;
            },
            filter: function(filters, filterName) {
              return _.find(filters, {name: filterName});
            },
            items: function(Submission, ItemsService, currentKapp, currentUser, filter, queueType) {
              return ItemsService.filter(currentKapp.slug, currentUser, filter, queueType);
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
          return Submission.build().one(itemId).get({include:'details,values'});
        }
      },

      views: {
        '': {
          controller: 'QueueDetailController as details',
          templateUrl: 'queue/queue.detail.tpl.html',
        }
      }
    });

    $stateProvider.state('queue.by.details.summary', {
      url: '/summary',

      views: {
        '': {
          controller: 'QueueSummaryController as vm',
          templateUrl: 'queue/queue.summary.tpl.html',
        }
      }
    });

    $stateProvider.state('queue.by.details.work', {
      url: '/work',

      views: {
        '': {
          controller: 'QueueWorkController as vm',
          templateUrl: 'queue/queue.work.tpl.html',
        }
      }
    });

    $stateProvider.state('queue.by.details.assignment', {
      url: '/assignment',

      views: {
        '': {
          controller: 'QueueAssignmentController as vm',
          templateUrl: 'queue/queue.assignment.tpl.html',
        }
      }
    });

    $stateProvider.state('queue.create', {
      url: '/create',
      views: {
        '': {
          templateUrl: 'queue/queue.new.item.tpl.html',
          controller: 'QueueNewItemController as vm',
          resolve: {
            forms: function(Form, currentKapp, queueType, $q) {
              var deferred = $q.defer();

              Form.build(currentKapp.slug).getList().then(
                function(forms) {
                  deferred.resolve(_.filter(forms, {type:queueType}));
                },
                function() {
                  deferred.reject('Failed to retrieve forms list.');
                }
              );

              return deferred.promise;
            }
          }
        }
      }
    });
  }
}());
