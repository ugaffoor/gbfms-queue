import angular from 'angular';
import _ from 'lodash';

angular
  .module('kd.core.models')
  .factory('Submission', Submission);

/* @ngInject */
function Submission($log, CoreAPI) {
  $log.info('{Model} Defining "Submission" model.');
  var factory = {
    search: search,
    build: build,
    save: save
  };
  return factory;

  function build(kappSlug, formSlug) {
    // If there's no Kapp defined, return the root submissions service.
    if(typeof kappSlug === 'undefined') {
      return CoreAPI.service('submissions');
      // If there's a form slug then scope the request by form.
    } else if(typeof formSlug !== 'undefined') {
      return CoreAPI.service('submissions', CoreAPI.one('kapps', kappSlug).one('forms', formSlug));
      // Otherwise, scope the request by Kapp.
    } else {
      return CoreAPI.service('submissions', CoreAPI.one('kapps', kappSlug));
    }
  }

  function search(kapp, form) {
    var searcher = new SubmissionSearch(kapp, form);
    return searcher;
  }

  function save(submission) {
    var SUBFORMS = ['Subtasks', 'Notes'];
    var DONT_SEND = ['children', 'closedAt', 'closedBy', 'coreState', 'createdAt', 'createdBy', 'currentPage', 'id',
      'label', 'origin', 'parent', 'sessionToken', 'submittedAt', 'submittedBy', 'type', 'updatedAt', 'updatedBy'];
    var id = submission.id;
    var page = submission.currentPage;

    _.each(SUBFORMS, function(fieldName) {
      var value = submission.values[fieldName];

      if(value === null) {
        value = [];
      }

      if(value instanceof Array) {
        value = JSON.stringify(value);
      }
      submission.values[fieldName] = value;
    });

    // Cull off the fields that submission's cannot have:
    _.each(DONT_SEND, function(fieldName) {
      delete submission[fieldName];
    });

    return submission.customPOST(submission, id, {'page':page,'staged':true});
  }

  function SubmissionSearch(kapp, form) {
    var self = this;
    self.kapp = kapp;
    self.form = form;

    self.searchMeta = {
      include: []
    };

    var validateOuter = function(message) {
      if(self.queryContext.length>1) {
        throw new Error(message);
      }
    };

    /******************************************************************************
      * NESTED QUERY CONTEXT MANAGEMENT
      *****************************************************************************/

    self.query = [];
    self.queryContext = [];
    self.queryContext.push(self.query);

    self.currentContext = function() {
      return self.queryContext[self.queryContext.length-1];
    };

    self.addContext = function(context) {
      self.queryContext.push(context);
    };

    self.endContext = function() {
      return self.queryContext.pop();
    };

    /******************************************************************************
      * QUERY STRING COMPILATION
      *****************************************************************************/

    var compileQueryString = function() {
      return doCompileQueryString(self.query, '', true);
    };

    function doCompileQueryString(queryContext, queryString, and) {
      and = !!and;
      for(var i=0; i<queryContext.length;i++) {
        var op = queryContext[i];
        if(i>0) {
          queryString += (and ? ' AND ' : ' OR ');
        }
        switch(op.op) {
          case 'eq':
            if(typeof op.rvalue === 'string' && op.rvalue === '') {
              queryString += op.lvalue + ' = null';
            } else {
              queryString += op.lvalue + ' = "' + op.rvalue + '"';
            }
            break;
          case 'in':
            queryString += op.lvalue + ' IN (';
            for(var rvi=0; rvi<op.rvalue.length; rvi++) {
              if(rvi>0) {
                queryString += ', ';
              }
              queryString += '"'+op.rvalue[rvi]+'"';
            }
            queryString += ')';
            break;
          case 'or':
          case 'and':
            var shouldAnd = (op.op === 'and' ? true : false);
            queryString += '( ';
            queryString += doCompileQueryString(op.context, '', shouldAnd);
            queryString +=  ')';
            break;
        }
      }

      return queryString;
    };

    /******************************************************************************
      * EXECUTION METHODS
      *****************************************************************************/

    self.execute = function() {
      validateOuter('Attempted to execute query before ending all groupings.');
      var q = compileQueryString();

      var restService;
      if(typeof self.kapp === 'undefined') {
        // Unscoped, space-wide search.
        restService = CoreAPI.service('submissions');
      } else if(typeof self.form !== 'undefined') {
        // Scoped by both a kapp and a form.
        restService = CoreAPI.service('submissions',
          CoreAPI.one('kapps', self.kapp)
            .one('forms', self.form));
      } else {
        // Scoped by only kapp.
        restService = CoreAPI.service('submissions',
          CoreAPI.one('kapps', self.kapp));
      }

      var meta = angular.copy(self.searchMeta);
      // Format includes.
      if(meta.include.length>0) {
        meta.include = _.join(meta.include);
      }
      // Add query string if necessary.
      if(!_.isEmpty(q)) {
        meta.q = q;
      }
      return restService.getList(meta);
    };

    self.raw = function() {
      return self.query;
    };

    /******************************************************************************
      * EQUALITY METHODS
      *****************************************************************************/

    self.eq = function(attribute, value) {
      var op = {op: 'eq', lvalue: attribute, rvalue: value};
      self.currentContext().push(op);
      return self;
    };

    self.in = function(attribute, value) {
      var op = { op: 'in', lvalue: attribute, rvalue: value };
      self.currentContext().push(op);
      return self;
    };

    /******************************************************************************
      * GROUPING METHODS
      *****************************************************************************/
    self.or = function() {
      var op = { op: 'or', context: [] };
      self.currentContext().push(op);
      self.addContext(op.context);
      return self;
    };

    self.and = function() {
      var op = { op: 'and', context: [] };
      self.currentContext().push(op);
      self.addContext(op.context);
      return self;
    };

    self.end = function() {
      self.endContext();
      return self;
    };

    /******************************************************************************
      * SORTING METHODS
      *****************************************************************************/

    var validTimelines = ['closedAt', 'createdAt', 'submittedAt', 'updatedAt'];
    self.sortBy = function(timeline) {
      validateOuter('Sorting cannot be nested.');
      // Check to see that timeline is in valid timelines.
      self.searchMeta.timeline = timeline;
      return self;
    };

    self.sortDirection = function(direction) {
      validateOuter('Sorting cannot be nested.');
      if(direction !== 'ASC' && direction !== 'DESC') {
        throw new Error('Invalid sort direction: ' + direction);
      }

      self.searchMeta.direction = direction;
      return self;
    };

    self.type = function(type) {
      validateOuter('Type qualification cannot be nested');
      self.searchMeta.type = type;
      return self;
    };

    self.coreState = function(coreState) {
      validateOuter('Core State cannot be nested');
      self.searchMeta.coreState = coreState;
      return self;
    };

    self.startDate = function(startDate) {
      validateOuter('Start Date cannot be nested.');
      if(!(startDate instanceof Date)) {
        throw new Error('Start Date must be a Date object.');
      }
      self.searchMeta.start = startDate.toISOString();
    };

    self.endDate = function(endDate) {
      validateOuter('End Date cannot be nested.');
      if(!(endDate instanceof Date)) {
        throw new Error('End Date must be a Date object.');
      }
      self.searchMeta.end = endDate.toISOString();
    };

    self.limit = function(limit) {
      validateOuter('Limit cannot be nested');
      self.searchMeta.limit = limit;
      return self;
    };

    self.pageToken = function(pageToken) {
      validateOuter('Page Token cannot be nested');
      self.searchMeta.pageToken = pageToken;
      return self;
    };

    self.include = function(include) {
      self.searchMeta.include.push(include);
      return self;
    };

    self.includes = function(includes) {
      self.searchMeta.include = _.uniq(_.concat(self.searchMeta.include, includes));
      return self;
    };
  }
}
