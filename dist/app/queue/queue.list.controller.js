(function() {
  'use strict';
  QueueListController.$inject = ["currentKapp", "currentUser", "queueType", "filter", "filterName", "items", "ItemsService", "$scope", "$rootScope"];
  angular
    .module('kd.bundle.angular.queue')
    .controller('QueueListController', QueueListController);

  /* @ngInject */
  function QueueListController(currentKapp, currentUser, queueType, filter, filterName, items, ItemsService, $scope, $rootScope) {
    var vm = this;
    vm.currentKapp = currentKapp;
    vm.loading = false;
    vm.items = items;
    vm.nextPageToken = items.nextPageToken;
    vm.prevPageTokens = [];
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.hasMorePages = hasMorePages;

    var queue = $scope.queue;
    queue.filterName = filterName;

    activate();

    function activate() {
    }

    function nextPage() {
      vm.loading = true;
      var pageToken =
      ItemsService.filter(currentKapp.slug, currentUser, filter, queueType, vm.nextPageToken).then(
        function(items) {
          vm.loading = false;
          vm.items = items;
          vm.prevPageTokens.push(vm.nextPageToken);
          vm.nextPageToken = items.nextPageToken;
        },
        function() {
          vm.loading = false;
          Toast.error('Failed to retrieve next page.');
        }
      );
    }

    function prevPage() {
      vm.loading = true;
      // Pop the current page off of the stack, and grab the previous page.
      vm.prevPageTokens.pop();
      var pageToken = _.last(vm.prevPageTokens);
      ItemsService.filter(currentKapp.slug, currentUser, filter, queueType, pageToken).then(
        function(items) {
          vm.loading = false;
          vm.items = items;
          vm.nextPageToken = items.nextPageToken;
        },
        function() {
          vm.loading = false;
          Toast.error('Failed to retrieve next page.');
        }
      );
    }

    function hasMorePages() {
      return !_.isEmpty(vm.prevPageTokens) || !_.isEmpty(vm.nextPageToken);
    }
  }
}());
