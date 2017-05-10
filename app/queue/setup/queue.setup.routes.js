import angular from 'angular';
import queueSetupTpl from './queue.setup.tpl.jade';

angular
  .module('kd.bundle.angular.queue.setup')
  .config(routes);

/* @ngInject */
function routes($stateProvider) {
  $stateProvider.state('setup', {
    parent: 'protected',
    url: '/setup',

    views: {
      '': {
        templateUrl: queueSetupTpl,
        controller: 'QueueSetupController as vm'
      }
    }
  });
}
