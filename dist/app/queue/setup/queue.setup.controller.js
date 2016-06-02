(function() {
  'use strict';
  QueueSetupController.$inject = ["currentKapp", "kapps", "AttributeDefinition", "Form", "FormTypes", "Toast", "$uibModal", "$q", "$scope"];
  angular
    .module('kd.bundle.angular.queue.setup')
    .controller('QueueSetupController', QueueSetupController);

  /* @ngInject */
  function QueueSetupController(currentKapp, kapps, AttributeDefinition, Form, FormTypes, Toast, $uibModal, $q, $scope) {
    var vm = this;

    var requiredAttributes = [
      { name:'Queue Name', allowsMutliple: false },
      { name: 'Queue Form Type', allowsMutliple: false },
      { name: 'Queue Filters', allowsMutliple: true },
      { name: 'Queue Details Value', allowsMutliple: false },
      { name: 'Helper Kapp Slug', allowsMutliple: false },
      { name: 'Queue Default Group', allowsMutliple: false },
      { name: 'Queue Setup Visible', allowsMultiple: false}
    ];

    vm.currentKapp = currentKapp;
    vm.kapps = kapps;
    vm.readyToEdit = true;

    vm.queueNameAttribute = {};
    vm.queueSetupVisibleAttribute = {};
    vm.queueTypeAttribute = {};
    vm.queueDetailsAttribute = {};
    vm.queueFilterAttribute = {};
    vm.queueDefaultGroup = {};
    vm.helperKappAttribute = {};

    vm.setup = {
      shouldCreateForm: false,
      initialForm: {
        name: '',
        slug: ''
      },
      addFilter: function() {
        var filterCriteria = {
          name: vm.setup.tmpFilterName,
          qualifications: []
        };

        vm.queueFilterAttribute.values.push(filterCriteria);
        vm.setup.tmpFilterName = '';
        vm.setup.editFilter(filterCriteria);
      },
      removeFilter: function(index) {
        vm.queueFilterAttribute.values.splice(index, 1);
      },
      doDefaults: function() {
        vm.queueSetupVisibleAttribute.values[0] = true;
        vm.queueNameAttribute.values[0] = 'Todo List';
        vm.queueTypeAttribute.values[0] = 'Todo Item';
        vm.queueDetailsAttribute.values[0] = 'Task';
        vm.helperKappAttribute.values[0] = 'admin';

        vm.queueFilterAttribute.values = [
          //{ name: 'All', query: 'values[Status]="Open"' },
          //{ name: 'Pending', query: 'values[Status]="Pending"' },
        ];
        vm.setup.shouldCreateForm = true;
        vm.setup.initialForm.name = 'Todo Item';
        vm.setup.initialForm.slug = 'todo-item';
      },
      isSetupValid: function() {
        return false;
      },
      save: function() {
        // Convert the filters to a string.
        vm.queueFilterAttribute.values = _.map(vm.queueFilterAttribute.values, function(filter) {
          return JSON.stringify(filter, function(key, value) { return (_.startsWith(key, '$$') ? undefined : value); });
        });

        // Validate that we have all the essential attribute definitions.
        validateMissingAttributes().then(
          function() {
            saveKapp().then(
              function() {
                setupConfigurationObject();
                addFormType().then(
                  function() {
                    createInitialForm().then(
                      function() {
                        Toast.success('Updated Kapp configuration.');
                      },
                      function() {
                        Toast.error('Failed to update Kapp configuration!');
                      }
                    );
                  },
                  function() {
                    Toast.error('Failed to update Kapp configuration!');
                  }
                );
              }
            );
          }
        );

      },

      editFilter: function(filter) {
        var instance = $uibModal.open({
          templateUrl: 'queue/setup/filter.qualification.modal.tpl.html',
          controller: 'FilterQualificationController as vm',
          size: 'lg',
          resolve: {
            filter: function() {
              return angular.copy(filter);
            }
          }
        });

        instance.result.then(
          function(updatedFilter) {
            filter.name = updatedFilter.name;
            filter.qualifications = updatedFilter.qualifications;
          }
        );
      }
    };

    activate();

    function activate() {
      setupConfigurationObject();
      // validateMissingAttributes();
    }

    function saveKapp() {
      return vm.currentKapp.put();
    }

    function createInitialForm() {
      var deferred = $q.defer();
      if(vm.setup.shouldCreateForm) {
        // Check the forms to make sure it doesn't already exist.
        Form.build(vm.currentKapp.slug).getList().then(
          function(forms) {
            if(_.some(forms, {slug: vm.setup.initialForm.slug})) {
              deferred.resolve();
            } else {
              Form.build(vm.currentKapp.slug).post(
                {
                  "anonymous": false,
                  "attributes": [],
                  "bridgedResources": [],
                  "categorizations": [],
                  "customHeadContent": null,
                  "description": "",
                  "name": vm.setup.initialForm.name,
                  "notes": null,
                  "pages": [
                    {
                      "advanceCondition": null,
                      "displayCondition": null,
                      "displayPage": null,
                      "elements": [
                        {
                          "type": "section",
                          "renderType": null,
                          "name": "Assignment Information",
                          "title": "",
                          "visible": false,
                          "omitWhenHidden": false,
                          "renderAttributes": {},
                          "elements": [
                            {
                              "type": "field",
                              "name": "Assigned Individual",
                              "label": "Assigned Individual",
                              "key": "f3",
                              "defaultValue": null,
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": false,
                              "requiredMessage": null,
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "text",
                              "rows": 1
                            },
                            {
                              "type": "field",
                              "name": "Assigned Individual Display Name",
                              "label": "Assigned Individual Display Name",
                              "key": "f4",
                              "defaultValue": null,
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": false,
                              "requiredMessage": null,
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "text",
                              "rows": 1
                            },
                            {
                              "type": "field",
                              "name": "Assigned Group",
                              "label": "Assigned Group",
                              "key": "f6",
                              "defaultValue": (_.isEmpty(vm.queueDefaultGroup.values[0]) ? null : vm.queueDefaultGroup.values[0]),
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": false,
                              "requiredMessage": null,
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "text",
                              "rows": 1
                            }
                          ]
                        },
                        {
                          "type": "section",
                          "renderType": null,
                          "name": "Status Information",
                          "title": "Status Information",
                          "visible": true,
                          "omitWhenHidden": null,
                          "renderAttributes": {},
                          "elements": [
                            {
                              "type": "field",
                              "name": "Due Date",
                              "label": "Due Date",
                              "key": "f5",
                              "defaultValue": null,
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": false,
                              "requiredMessage": null,
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "date"
                            },
                            {
                              "type": "field",
                              "name": "Status",
                              "label": "Status",
                              "key": "f2",
                              "defaultValue": "Open",
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": true,
                              "requiredMessage": "A valid status must be set.",
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "dropdown",
                              "choicesResourceName": null,
                              "choicesRunIf": null,
                              "choices": [
                                {
                                  "label": "Open",
                                  "value": "Open"
                                },
                                {
                                  "label": "Pending",
                                  "value": "Pending"
                                },
                                {
                                  "label": "In Progress",
                                  "value": "In Progress"
                                },
                                {
                                  "label": "Complete",
                                  "value": "Complete"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "type": "section",
                          "renderType": null,
                          "name": "Item Details",
                          "title": "Item Details",
                          "visible": true,
                          "omitWhenHidden": null,
                          "renderAttributes": {},
                          "elements": [
                            {
                              "type": "field",
                              "name": "Task",
                              "label": "Task",
                              "key": "f1",
                              "defaultValue": null,
                              "defaultResourceName": null,
                              "visible": true,
                              "enabled": true,
                              "required": false,
                              "requiredMessage": null,
                              "omitWhenHidden": null,
                              "pattern": null,
                              "constraints": [],
                              "events": [],
                              "renderAttributes": {},
                              "dataType": "string",
                              "renderType": "text",
                              "rows": 1
                            }
                          ]
                        },
                        {
                          "type": "button",
                          "label": "Save",
                          "name": "Save",
                          "visible": true,
                          "enabled": true,
                          "renderType": "save",
                          "renderAttributes": {}
                        },
                        {
                          "type": "button",
                          "label": "Complete",
                          "name": "Complete",
                          "visible": true,
                          "enabled": true,
                          "renderType": "submit-page",
                          "renderAttributes": {}
                        }
                      ],
                      "events": [],
                      "name": "Page One",
                      "renderType": "submittable",
                      "type": "page"
                    },
                    {
                      "advanceCondition": null,
                      "displayCondition": null,
                      "displayPage": null,
                      "elements": [],
                      "events": [],
                      "name": "Confirmation",
                      "renderType": "confirmation",
                      "type": "page"
                    }
                  ],
                  "securityPolicies": [],
                  "slug": vm.setup.initialForm.slug,
                  "status": "New",
                  "submissionLabelExpression": "${form('name')}",
                  "type": vm.queueTypeAttribute.values[0],
                }
              ).then(
                function() {
                  deferred.resolve();
                },
                function() {
                  deferred.reject();
                }
              );
            }
          }
        );
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function addFormType() {
      var deferred = $q.defer();

      FormTypes.build(vm.currentKapp.slug).getList().then(
        function(formTypes) {
          if(_.some(formTypes, {name: vm.queueTypeAttribute.values[0]})) {
            deferred.resolve();
          } else {
            FormTypes.build(vm.currentKapp.slug).post({name: vm.queueTypeAttribute.values[0]}).then(
              function() {
                deferred.resolve();
              },
              function() {
                deferred.reject();
              }
            );
          }
        },
        function() {
          deferred.reject();
        }
      );

      return deferred.promise;
    }

    function setupConfigurationObject() {
      vm.queueNameAttribute = _.find(vm.currentKapp.attributes, {name: 'Queue Name'});
      if(_.isEmpty(vm.queueNameAttribute)) {
        vm.queueNameAttribute = { name: 'Queue Name', values: [''] };
        vm.currentKapp.attributes.push(vm.queueNameAttribute);
      }
      vm.queueSetupVisibleAttribute = _.find(vm.currentKapp.attributes, {name: 'Queue Setup Visible'});
      if(_.isEmpty(vm.queueSetupVisibleAttribute)) {
        vm.queueSetupVisibleAttribute = { name: 'Queue Setup Visible', values: [true] };
        vm.currentKapp.attributes.push(vm.queueSetupVisibleAttribute);
      }
      vm.queueTypeAttribute = _.find(vm.currentKapp.attributes, {name: 'Queue Type'});
      if(_.isEmpty(vm.queueTypeAttribute)) {
        vm.queueTypeAttribute = { name: 'Queue Type', values: [''] };
        vm.currentKapp.attributes.push(vm.queueTypeAttribute);
      }
      vm.queueDetailsAttribute = _.find(vm.currentKapp.attributes, {name: 'Queue Details Value'});
      if(_.isEmpty(vm.queueDetailsAttribute)) {
        vm.queueDetailsAttribute = { name: 'Queue Details Value', values: [''] };
        vm.currentKapp.attributes.push(vm.queueDetailsAttribute);
      }
      vm.queueDefaultGroup = _.find(vm.currentKapp.attributes, {name: 'Queue Default Group'});
      if(_.isEmpty(vm.queueDefaultGroup)) {
        vm.queueDefaultGroup = { name: 'Queue Default Group', values: []};
        vm.currentKapp.attributes.push(vm.queueDefaultGroup);
      }
      vm.queueFilterAttribute = _.find(vm.currentKapp.attributes, {name: 'Queue Filters'});
      if(_.isEmpty(vm.queueFilterAttribute)) {
        vm.queueFilterAttribute = { name: 'Queue Filters', values: [] };
        vm.currentKapp.attributes.push(vm.queueFilterAttribute);
      } else {
        vm.queueFilterAttribute.values = _.map(vm.queueFilterAttribute.values, function(filter) {
          if(typeof filter === 'string') {
            return JSON.parse(filter);
          }
          return filter;
        });
      }
      vm.helperKappAttribute = _.find(vm.currentKapp.attributes, {name: 'Helper Kapp Slug'});
      if(_.isEmpty(vm.helperKappAttribute)) {
        vm.helperKappAttribute = { name: 'Helper Kapp Slug', values: [''] };
        vm.currentKapp.attributes.push(vm.helperKappAttribute);
      }
    }

    function validateMissingAttributes() {
      var deferred = $q.defer();
      var attributes = vm.currentKapp.attributes;
      // Retrieve all attribute definitions for the kapp.
      AttributeDefinition.build('Kapp', vm.currentKapp.slug).getList().then(
        function(attributeDefinitions) {
          // Next we'll go through all of the required attributes and make sure
          // that we create an attribute definition for each of the missing ones.
          var definitionsToCreate = [];
          _.each(requiredAttributes, function(definition) {
            if(!_.some(attributeDefinitions, {name:definition.name})) {
              definitionsToCreate.push(definition);
            }
          });
          createMissingAttributeDefinitions(definitionsToCreate).then(
            function() {
              deferred.resolve();
            });
        },
        function() {
          deferred.reject();
        }
      );

      return deferred.promise;
    }

    function createMissingAttributeDefinitions(attributeDefinitions) {
      var deferred = $q.defer();
      if(attributeDefinitions.length > 0) {
        var newDefinition = attributeDefinitions.pop();
        AttributeDefinition
          .build('Kapp', vm.currentKapp.slug)
          .post(newDefinition)
          .then(
            function(result) {
              // If there are remaining attribute definitions then recursively call
              // this create function.
              if(attributeDefinitions.length > 0) {
                // Only resolve our promise once the chain resolves.
                createMissingAttributeDefinitions(attributeDefinitions).then(
                  function() {
                    deferred.resolve();
                  }
                );
              } else {
                // Resolve the last promise in the chain.
                deferred.resolve();
              }
            }, function(error) {
              Toast.error('Failed to create required attribute definition "'+definition+'".');
            }
          );
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }
  }
}());
