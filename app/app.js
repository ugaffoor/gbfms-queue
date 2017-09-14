import angular from 'angular';
import { TemplateCache } from './template.cache.module';

'use strict';

var modules = [
  'kd.core',
  'kd.core.authentication',
  'kd.core.models',

  'kd.bundle.angular.common',
  TemplateCache,

  'kd.bundle.angular.errors',

  'kd.bundle.angular.layout',
  'kd.bundle.angular.queue',
  'kd.bundle.angular.queue.setup'
];

if(bundle && bundle.config && bundle.config.queue && bundle.config.queue.discussion) {
  modules.push('kd.response');
}
angular.module('kd.bundle.angular', modules).run(function($rootScope, $state) {
  'ngInject';
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if(error.status != 401) {
      $state.go('error.system');
    }
    console.log('failed to change state', arguments);
  });

  // Find cloaked things and uncloak them.
  const cloaks = document.querySelectorAll('.kd-cloak');
  for (let index=0; index < cloaks.length; index++) {
    cloaks[index].classList.remove('kd-cloak')
  }
});

