import angular from 'angular';
import setupError from './error.setup.tpl.jade';
import systemError from './error.system.tpl.jade';

angular
  .module('kd.bundle.angular.errors')
  .config(routes);

/* @ngInject */
function routes($stateProvider) {
  $stateProvider.state('error', {
    parent: 'public',
    abstract: true,
    url: '/error',
    //templateUrl: 'errors/error.layout.tpl.html'
    template: '<div data-ui-view=""></div>'
  });

  $stateProvider.state('error.setup', {
    url: '/setup',
    views: {
      '': {
        templateUrl: setupError
      }
    }
  });

  $stateProvider.state('error.system', {
    url: '/system',
    views: {
      '': {
        templateUrl: systemError
      }
    }
  });
}
