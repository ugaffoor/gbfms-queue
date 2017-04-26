import angular from 'angular';

angular
  .module('kd.bundle.angular.queue')
  .controller('QueueNewListController', QueueNewListController);

/* @ngInject */
function QueueNewListController(currentKapp, currentUser, forms, Bundle, $window, $timeout) {
  var createList = this;
  createList.forms = forms;
  createList.activeTeam = '';
  createList.filteredForms = [];
  createList.loadedForm = {};

  createList.myTeams = _.map(currentUser.memberships, function(membership) {
    return membership.team.name;
  });

  createList.isFormLoaded = function() {
    return !_.isEmpty(createList.loadedForm);
  };

  createList.unloadForm = function() {
    var K = $window.K;

    createList.loadedForm = {};
    K.reset();
    $('#formContainer').empty();
  }
}
