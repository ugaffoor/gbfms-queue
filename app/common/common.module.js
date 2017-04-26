import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import restangular from 'restangular';
import ngMd5 from 'angular-md5';
import dndLists from 'angular-drag-and-drop-lists';
import ngLetterAvatar from 'ngletteravatar';

angular.module('kd.bundle.angular.common', [
  ngAnimate,
  ngSanitize,
  uiRouter,
  uiBootstrap,
  restangular,
  ngMd5,
  'ngLetterAvatar',
  'dndLists'
]);
