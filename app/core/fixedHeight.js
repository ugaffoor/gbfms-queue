import angular from 'angular'
import $ from 'jquery';

angular
  .module('kd.core')
  .directive('fixedHeight', fixedHeight);

/* @ngInject */
function fixedHeight($window) {
  // Usage:
  // <div fixed-height="" fh-bottom-pad="#footer" fh-top-pad="#header" fh-header="floating">
  var directive = {
    link: link,
    restrict: 'A'
  };
  return directive;

  function link(scope, element, attrs) {
    var rect = element[0].getBoundingClientRect();
    var w = angular.element($window);
    var isFloating = (attrs.fhHeader === 'floating');

    // If the header is floating we need to explicitly set the top to where it's currently rendered.
    if(isFloating) {
      $(element).css('top', top + 'px');
    }
    $(element).css('overflow-x', 'hidden');

    var getPad = function(padAttr) {
      var pad;
      if (_.isEmpty(padAttr) ) {
        pad = 0;
      } else if (typeof padAttr === 'string' && (padAttr[0] === '.' || padAttr[0] === '#')) {
        var padElement = $(padAttr);
        if(padElement.is(':visible')) {
          pad = padElement.height();
        }
        pad = pad || 0;
      } else {
        pad = padAttr;
      }
      return pad;
    };

    scope.getWindowDimensions = function() {
      var rect = element[0].getBoundingClientRect();
      return {
        height: $window.innerHeight,
        bottomPad: getPad(attrs.fhBottomPad),
        topPad: getPad(attrs.fhTopPad),
        top: rect.top
      };
    };

    scope.$watch(scope.getWindowDimensions, function(win) {
      $(element).css('height', win.height - win.top - win.bottomPad - win.topPad - 15);
    }, true);

    w.bind('resize', function() {
      scope.$apply();
    });
  }
}
