(function() {
  'use strict';

  ItemsService.$inject = ["Submission"];
  angular
    .module('kd.bundle.angular.queue')
    .service('ItemsService', ItemsService);

  /* @ngInject */
  function ItemsService(Submission) {
    var service = {
      filter: filter
    };

    return service;

    function filter(kappSlug, user, itemFilter, formType, pageToken) {
      var searcher =  Submission.search(kappSlug);

      _.each(itemFilter.qualifications, function(qualification) {
        if(qualification.value === '${openStatuses}') {
          var openStatuses = ['Open', 'In Progress'];
          searcher.or();
          _.each(openStatuses, function(status) {
            searcher.eq(qualification.field, status);
          });
          searcher.end();
        } else {
          var rval = qualification.value;
          var lval = qualification.field;

          if(qualification.value === '${me}') {
            rval = user.username;
          }

          if(_.startsWith(lval, 'values')) {
            searcher.eq(lval, rval);
          } else {
            switch(lval) {
              case 'coreState':
                searcher.coreState(rval);
                break;
              case 'timeline':
                if(_.some(Submission.timelines, rval)) {
                  searcher.timeline(rval);
                }
                break;
              case 'range':
                var range = createRange(rval);
                searcher.range(range.startDate, range.endDate);
                break;
              case 'start':
                searcher.startRange(new Date(rval));
                break;
              case 'end':
                searcher.endRange(new Date(rval));
                break;
              default:
                break;
            }
          }

        }

      });

      if(!_.isEmpty(pageToken)) {
        searcher.pageToken(pageToken);
      }

      return searcher
        .type(formType)
        .limit(5)
        .includes(['values','details,form'])
        .execute();
    }

    function createRange(rangeToken) {
      var end = new Date();
      var start = new Date();

      if(rangeToken === '${now-1h}') {
        start = moment(start).subtract(1, 'hour');
      }

      return {startDate: start, endDate: end};
    }
  }
}());
