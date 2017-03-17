(function() {
  'use strict';

  gravatar.$inject = ["MD5"];
  angular
    .module('kd.core')
    .directive('gravatar', gravatar);

  /* @ngInject */
  function gravatar(MD5) {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        email: '@'
      },
      link: link,
      template: '<img alt="{{ name }}" height="{{ height }}"  width="{{ width }}" src="https://secure.gravatar.com/avatar/{{ emailHash }}.jpg?s={{ width }}&d={{ defaultImage }}">'
    };

    return directive;

    function link(scope, element, attrs) {
      scope.name = _.isEmpty(attrs.name) ? scope.email : attrs.name;
      scope.defaultImage = _.isEmpty(attrs.defaultImage) ? 'mm' : attrs.defaultImage;
      scope.height = _.isEmpty(attrs.height) ? '20' : attrs.height;
      scope.width = _.isEmpty(attrs.width) ? '20' : attrs.width;
      scope.emailHash = MD5(scope.email);
    }
  }
})();
