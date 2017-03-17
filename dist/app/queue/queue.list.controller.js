(function() {
  'use strict';
  QueueListController.$inject = ["currentKapp", "currentUser", "filter", "filterName", "filterType", "items", "openItems", "ItemsService", "$scope", "$state", "$stateParams"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueListController', QueueListController);

  /* @ngInject */
  function QueueListController(
    currentKapp, currentUser, filter, filterName, filterType, items, openItems,
      ItemsService,
      $scope, $state, $stateParams) {
    var list = this;
    var STATE_MATCH = /queue\.by\./;

    list.currentKapp = currentKapp;
    list.loading = false;
    list.items = items;
    list.activeItem;
    list.nextPageToken = items.nextPageToken;
    list.prevPageTokens = [];

    list.nextPage = nextPage;
    list.prevPage = prevPage;
    list.hasMorePages = hasMorePages;
    list.hasItems = hasItems;

    list.isChildState = isChildState;
    list.isActiveItem = isActiveItem;
    list.selectItem = selectItem;

    var queue = $scope.queue;
    queue.filterName = filterName;
    queue.filterType = filterType;
    queue.openItems = openItems;

    activate();

    function activate() {
      queue.showList();
      queue.populateStats();
      list.activeItem = null;
    }

    function isChildState() {
      var currentState = $state.current.name;
      return currentState.match(STATE_MATCH) !== null;
    }

    function isActiveItem(item) {
      return list.activeItem === item.id;
    }

    function selectItem(item) {
      if(isActiveItem(item)) {
        queue.xsView = 'details';
      } else {
        list.activeItem = item.id;
        $state.go('queue.by.details.summary', {itemId: item.id});
      }
    }

    function nextPage() {
      list.loading = true;
      ItemsService.filter(currentKapp.slug, currentUser, filter, list.nextPageToken).then(
        function(items) {
          list.loading = false;
          list.items = items;
          list.prevPageTokens.push(list.nextPageToken);
          list.nextPageToken = items.nextPageToken;
        },
        function() {
          list.loading = false;
          Toast.error('Failed to retrieve next page.');
        }
      );
    }

    function prevPage() {
      list.loading = true;
      // Pop the current page off of the stack, and grab the previous page.
      list.prevPageTokens.pop();
      var pageToken = _.last(list.prevPageTokens);
      ItemsService.filter(currentKapp.slug, currentUser, filter, pageToken).then(
        function(items) {
          list.loading = false;
          list.items = items;
          list.nextPageToken = items.nextPageToken;
        },
        function() {
          list.loading = false;
          Toast.error('Failed to retrieve next page.');
        }
      );
    }

    function hasMorePages() {
      return !_.isEmpty(list.prevPageTokens) || !_.isEmpty(list.nextPageToken);
    }

    function hasItems() {
      return list.items && list.items.length > 0;
    }
  }
}());
