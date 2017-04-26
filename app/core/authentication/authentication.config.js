import angular from 'angular';

angular
  .module('kd.core.authentication')
  .config(config);

/* @ngInject */
function config($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}
