import angular from 'angular';
import moment from 'moment';
import _ from 'lodash';

angular
  .module('kd.bundle.angular')
  .constant('moment', moment)
  .constant('_', _);
