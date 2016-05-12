angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('catalog/catalog.card.tpl.html',
    '\n' +
    '<div class="panel panel-primary">\n' +
    '  <div class="panel-heading">\n' +
    '    <h4 class="panel-title"><a href="" data-ui-sref="catalog.form({formSlug: form.slug})" class="btn btn-sm btn-primary">View</a>&nbsp;{{form.name}}</h4>\n' +
    '  </div>\n' +
    '  <div class="panel-body">\n' +
    '    <p>{{form.description || \'This is a \' + form.type + \' form.\'}}</p>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('catalog/catalog.tpl.html',
    '\n' +
    '<div class="container">\n' +
    '  <div data-ng-if="!vm.isChildActive()" class="row">\n' +
    '    <div data-ng-repeat="form in vm.forms" class="col-xs-s12 col-md-6">\n' +
    '      <div data-ng-include="\'catalog/catalog.card.tpl.html\'"></div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="row">\n' +
    '    <div data-ng-if="vm.isChildActive()" class="col-xs-3">\n' +
    '      <div data-ng-repeat="form in vm.forms" data-ng-include="\'catalog/catalog.card.tpl.html\'"></div>\n' +
    '    </div>\n' +
    '    <div class="col-xs-9">\n' +
    '      <div data-ui-view=""></div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('catalog/foo.html',
    '\n' +
    '<h1>lksjdflksjflksjf</h1>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('catalog/form.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-6"></div>\n' +
    '</div>\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12">\n' +
    '    <div class="panel panel-primary">\n' +
    '      <div class="panel-heading">\n' +
    '        <div class="row">\n' +
    '          <div class="col-xs-8">\n' +
    '            <h4 class="panel-title">{{vm.form.name}}</h4>\n' +
    '          </div>\n' +
    '          <div class="col-xs-4">\n' +
    '            <div class="btn-group pull-right"><a data-ui-sref="catalog" class="btn btn-sm btn-primary">Back</a><a data-ui-sref="catalog.form({formSlug: vm.form.slug})" data-ui-sref-opts="{reload:true}" class="btn btn-sm btn-primary">Restart</a></div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="panel-body">\n' +
    '        <div id="formContainer"></div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('errors/error.layout.tpl.html',
    '\n' +
    '<nav class="navbar navbar-default navbar-fixed-top">\n' +
    '  <div class="container">\n' +
    '    <div class="navbar-header">\n' +
    '      <!--button(type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" class="navbar-toggle collapsed")\n' +
    '      span.sr-only Toggle navigation\n' +
    '      span.icon-bar\n' +
    '      span.icon-bar\n' +
    '      span.icon-bar\n' +
    '      --><a href="" class="navbar-brand">Oh no!</a>\n' +
    '    </div>\n' +
    '    <!--div.navbar-collapse.collapse#navbar\n' +
    '    ul.nav.navbar-nav\n' +
    '      li(data-ng-class="{\'active\': layout.isParentActive(\'queue\')}")\n' +
    '        a(data-ui-sref="queue.by({filterName: \'__default__\'})") Queue\n' +
    '      li(data-ng-class="{\'active\': layout.isParentActive(\'catalog\')}")\n' +
    '        a(data-ui-sref="catalog") Catalog\n' +
    '      li(data-ng-if="layout.isSpaceAdmin()",data-ng-class="{\'active\': layout.isParentActive(\'setup\')}")\n' +
    '        a(data-ui-sref="setup") Queue Setup\n' +
    '    ul.nav.navbar-nav.navbar-right\n' +
    '      li.dropdown\n' +
    '        a.dropdown-toggle(href="",data-toggle="dropdown",role="button",aria-haspopup="true",aria-expanded="false")\n' +
    '          i.fa.fa-fw.fa-th\n' +
    '        ul.dropdown-menu\n' +
    '          li(data-ng-repeat="kapp in layout.kapps")\n' +
    '            a(href="{{layout.kappUrl(kapp)}}") {{kapp.name}}\n' +
    '    -->\n' +
    '  </div>\n' +
    '</nav>\n' +
    '<main>\n' +
    '  <div data-ui-view="" class="container"></div>\n' +
    '</main>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('errors/error.setup.tpl.html',
    '\n' +
    '<h1>Kapp Configuration</h1>\n' +
    '<div class="alert alert-warning"> \n' +
    '  <h5>This kapp has not been configured, please have a space administrator configure it before attempting to use it.</h5>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('errors/error.system.tpl.html',
    '\n' +
    '<h1>System Error</h1>\n' +
    '<div class="alert alert-warning"> \n' +
    '  <h5>There was a problem connecting to the Request CE system. Please contact your space administrator.</h5>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('layout/layout.default.tpl.html',
    '\n' +
    '<nav class="navbar navbar-default navbar-fixed-top">\n' +
    '  <div class="container">\n' +
    '    <div class="navbar-header">\n' +
    '      <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" class="navbar-toggle collapsed"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="" class="navbar-brand">{{layout.kapp.name}}</a>\n' +
    '    </div>\n' +
    '    <div id="navbar" class="navbar-collapse collapse">\n' +
    '      <ul class="nav navbar-nav">\n' +
    '        <li data-ng-class="{\'active\': layout.isParentActive(\'queue\')}"><a data-ui-sref="queue.by({filterName: \'__default__\'})">Queue</a></li>\n' +
    '        <li data-ng-class="{\'active\': layout.isParentActive(\'catalog\')}"><a data-ui-sref="catalog">Catalog</a></li>\n' +
    '        <li data-ng-if="layout.isSpaceAdmin()" data-ng-class="{\'active\': layout.isParentActive(\'setup\')}"><a data-ui-sref="setup">Queue Setup</a></li>\n' +
    '      </ul>\n' +
    '      <ul class="nav navbar-nav navbar-right">\n' +
    '        <li class="dropdown"><a href="" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-fw fa-th"></i></a>\n' +
    '          <ul class="dropdown-menu">\n' +
    '            <li data-ng-repeat="kapp in layout.kapps"><a href="{{layout.kappUrl(kapp)}}">{{kapp.name}}</a></li>\n' +
    '          </ul>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</nav>\n' +
    '<main>\n' +
    '  <div data-ui-view="" class="container"></div>\n' +
    '</main>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.assignment.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12">\n' +
    '    <h4>Assignment</h4>\n' +
    '    <div class="list-group">\n' +
    '      <div data-ng-repeat="group in vm.groups" class="list-group-item"><span class="fa fa-fw fa-users"></span>{{group}}<a data-ng-click="vm.startMidGroupAssignment($index)" class="btn btn-sm btn-default pull-right">Reassign</a></div>\n' +
    '      <div data-ng-if="vm.memberId" class="list-group-item">\n' +
    '        <ng-letter-avatar data="{{vm.memberId}}" height="14px" width="14px" shape="round" fontsize="12"></ng-letter-avatar>{{vm.memberId}}<a data-ng-click="vm.startMemberAssignment()" class="btn btn-sm btn-default pull-right">Reassign</a>\n' +
    '      </div>\n' +
    '      <div data-ng-if="vm.canAssignGroup() &amp;&amp; vm.groups.length &lt; 1" class="list-group-item"><a data-ng-click="vm.startGroupAssignment()" class="btn btn-default btn-block">Start Group Assignment</a></div>\n' +
    '      <div data-ng-if="vm.canAssignGroup() &amp;&amp; vm.groups.length &gt; 0" class="list-group-item"><a data-ng-click="vm.startMidGroupAssignment(vm.groups.length)" class="btn btn-default btn-block">Continue Group Assignment</a></div>\n' +
    '      <div data-ng-if="vm.state.assigningGroups || vm.state.assigningMembers" class="list-group-item">\n' +
    '        <div class="list-group">\n' +
    '          <div data-ng-repeat="group in vm.groupsToAssign" class="list-group-item"><span class="fa fa-fw fa-users"></span>{{group.values[\'Group\']}}<a data-ng-click="vm.startGroupAssignment(group.values[\'Group\'])" class="btn btn-sm btn-default pull-right">Choose</a></div>\n' +
    '          <div data-ng-repeat="member in vm.membersToAssign" class="list-group-item">\n' +
    '            <ng-letter-avatar data="{{vm.getNameFromMember(member)}}" height="14px" width="14px" shape="round" fontsize="12"></ng-letter-avatar>{{vm.getNameFromMember(member)}}<a data-ng-click="vm.selectMember(member)" class="btn btn-sm btn-default pull-right">Choose</a>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div data-ng-if="!vm.canAssignGroup() &amp;&amp; vm.state.showMembersButton" class="list-group-item"><a data-ng-click="vm.startMemberAssignment()" class="btn btn-default btn-block">Start Member Assignment</a></div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.state.assigningGroups || vm.state.assigningMembers" class="pull-right"><a data-ng-click="vm.cancel()" class="btn btn-sm btn-link">Cancel</a><a data-ng-click="vm.save()" class="btn btn-sm btn-default">Done</a></div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.detail.tpl.html',
    '\n' +
    '<div class="panel panel-default">\n' +
    '  <div class="panel-heading">\n' +
    '    <ul class="nav nav-tabs">\n' +
    '      <li role="presentation" data-ui-sref-active="active"><a data-ui-sref="queue.by.details.summary">Summary</a></li>\n' +
    '      <li role="presentation" data-ui-sref-active="active"><a data-ui-sref="queue.by.details.work">Work</a></li>\n' +
    '      <li role="presentation" data-ui-sref-active="active"><a data-ui-sref="queue.by.details.assignment">Assignment</a></li>\n' +
    '      <li data-ng-if="queue.loading"><span class="fa fa-fw fa-3x fa-spin fa-circle-o-notch"></span></li>\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '  <div class="panel-body">\n' +
    '    <div data-ui-view=""></div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.list.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12 col-sm-4">\n' +
    '    <div class="list-group"><a data-ng-if="!vm.loading" data-ui-sref="queue.by.details.summary({itemId: item.id})" data-ng-repeat="item in vm.items" class="list-group-item">\n' +
    '        <h5 class="list-group-item-heading">{{item.label}}</h5>\n' +
    '        <p class="list-group-item-text">\n' +
    '          <div class="row">\n' +
    '            <div class="col-xs-6"><span class="fa fa-fw fa-user"></span>{{queue.friendlyAssignedName(item)}}</div>\n' +
    '            <div class="col-xs-6"><span class="fa fa-fw fa-users"></span>{{queue.friendlyAssignedGroup(item)}}</div>\n' +
    '          </div>\n' +
    '          <div class="row">\n' +
    '            <div class="col-xs-6"><span class="fa fa-fw fa-calendar"></span><span data-time-ago="queue.friendlyDueDate(item)" data-ng-class="{\'text-danger\': queue.isOverdue(queue.friendlyDueDate(item))}"></span></div>\n' +
    '            <div class="col-xs-6"><span class="fa fa-fw fa-flag"></span>{{queue.friendlyStatus(item)}}</div>\n' +
    '          </div>\n' +
    '          <div class="row">\n' +
    '            <div class="col-xs-12">{{queue.friendlyDetails(item)}}</div>\n' +
    '          </div>\n' +
    '        </p></a>\n' +
    '      <div data-ng-if="vm.items.length &lt; 1" class="list-group-item">There are no items in this queue.</div>\n' +
    '      <div data-ng-if="vm.hasMorePages()" class="list-group-item">\n' +
    '        <ul class="pager queue-pager">\n' +
    '          <li><a data-ng-if="vm.prevPageTokens.length &gt; 0" data-ng-click="vm.prevPage()">Previous</a></li>\n' +
    '          <li><a data-ng-if="vm.nextPageToken" data-ng-click="vm.nextPage()">Next</a></li>\n' +
    '        </ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="col-xs-12 col-sm-8">\n' +
    '    <div data-ui-view="">\n' +
    '      <div class="panel panel-default">\n' +
    '        <div class="panel-body">Please select an item from the list.</div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.logs.tpl.html',
    '\n' +
    '<h1>Logs!!</h1>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.new.item.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div data-ng-class="{\'col-md-4\': vm.isFormLoaded()}" class="col-xs-12">\n' +
    '    <div class="list-group"><a href="" data-ng-repeat="form in vm.forms" data-ng-click="vm.loadForm(form)" class="list-group-item">\n' +
    '        <h4 class="list-group-item-heading">{{form.name}}</h4>\n' +
    '        <p class="list-group-item-text">{{form.description || \'A \' + vm.queueType + \' form.\'}}</p></a></div>\n' +
    '  </div>\n' +
    '  <div class="col-xs-12 col-md-8">\n' +
    '    <h3>{{vm.loadedForm.name}}</h3>\n' +
    '    <div id="formContainer"></div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.summary.tpl.html',
    '\n' +
    '<div class="panel panel-primary">\n' +
    '  <div class="panel-heading">\n' +
    '    <h5 class="panel-title">{{vm.item.label}}</h5>\n' +
    '  </div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="row">\n' +
    '      <div class="col-xs-6"><span class="fa fa-fw fa-user"></span>{{queue.friendlyAssignedName(vm.item)}}</div>\n' +
    '      <div class="col-xs-6"><span class="fa fa-fw fa-users"></span>{{queue.friendlyAssignedGroup(vm.item)}}</div>\n' +
    '    </div>\n' +
    '    <div class="row">\n' +
    '      <div class="col-xs-6"><span class="fa fa-fw fa-calendar"></span><span data-time-ago="queue.friendlyDueDate(vm.item)" data-ng-class="{\'text-danger\': queue.isOverdue(queue.friendlyDueDate(vm.item))}"></span></div>\n' +
    '      <div class="col-xs-6"><span class="fa fa-fw fa-flag"></span>{{queue.friendlyStatus(vm.item)}}</div>\n' +
    '    </div>\n' +
    '    <div class="row">\n' +
    '      <div class="col-xs-12">\n' +
    '        <div class="well">{{queue.friendlyDetails(vm.item)}}</div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div data-ng-if="details.isMine()" class="row">\n' +
    '  <div class="col-xs-6">\n' +
    '    <button data-ui-sref="queue.by.details.work" class="btn btn-primary btn-block">Work It</button>\n' +
    '  </div>\n' +
    '  <div class="col-xs-6">\n' +
    '    <button data-ui-sref="queue.by.details.assignment" class="btn btn-warning btn-block">Reassign It</button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div data-ng-if="!details.isMine()" class="row">\n' +
    '  <div class="col-xs-6">\n' +
    '    <button data-ng-click="details.grabIt()" class="btn btn-primary btn-block">Grab It</button>\n' +
    '  </div>\n' +
    '  <div class="col-xs-6">\n' +
    '    <button data-ui-sref="queue.by.details.assignment" class="btn btn-warning btn-block">Assign It</button>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12">\n' +
    '    <h3>{{queue.queueName}} <small><a data-ui-sref="queue.create" class="btn btn-default btn-sm">Add {{queue.queueType}}</a></small></h3>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12">\n' +
    '    <ul class="nav nav-pills hidden-xs">\n' +
    '      <li data-ng-repeat="filter in queue.filters" data-ng-class="{\'active\': queue.filterName === filter.name}"><a href="" data-ui-sref="queue.by({filterName: filter.name})">{{filter.name}}</a></li>\n' +
    '    </ul>\n' +
    '    <select data-ng-options="filter.name as filter.name for filter in queue.filters" data-ng-model="queue.filterName" data-ng-change="queue.changeFilter()" class="form-control visible-xs"></select>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div data-ui-view=""></div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/queue.work.tpl.html',
    '\n' +
    '<div data-ng-if="!details.isMine()">\n' +
    '  <h4>Current {{queue.queueType}} is not assigned to you.</h4><a data-ng-click="details.grabIt()" class="btn btn-block btn-primary">Grab It</a>\n' +
    '</div>\n' +
    '<div id="workContainer"></div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('core/authentication/login.modal.tpl.html',
    '\n' +
    '<form name="loginModalForm" data-ng-submit="vm.submit()" class="form-horizontal">\n' +
    '  <div class="modal-content">\n' +
    '    <div class="modal-header">\n' +
    '      <h4 class="modal-title">Login</h4>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-offset-1 col-xs-10">\n' +
    '          <div ng-if="vm.hasError" class="alert alert-danger">{{vm.errorMsg}}</div>\n' +
    '          <div class="form-group">\n' +
    '            <label for="_username" class="control-label">Username</label>\n' +
    '            <input id="_username" type="text" name="_username" data-ng-model="_username" class="form-control"/>\n' +
    '          </div>\n' +
    '          <div class="form-group">\n' +
    '            <label for="_password" class="control-label">Password</label>\n' +
    '            <input id="_password" type="password" name="_password" data-ng-model="_password" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '      <button type="submit" class="btn btn-default">Login</button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</form>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('core/toast/error.html',
    '\n' +
    '<div>\n' +
    '  <p>{{options.message}}</p>\n' +
    '  <p data-ng-if="data.error &amp;&amp; !options.overwrite">{{data.error}}</p>\n' +
    '  <div data-ng-if="data.errors">\n' +
    '    <div data-ng-repeat="(name, errors) in data.errors">\n' +
    '      <ul>\n' +
    '        <li data-ng-repeat="error in errors">{{error}}</li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/setup/filter.qualification.modal.tpl.html',
    '\n' +
    '<div class="modal-content">\n' +
    '  <div class="modal-header">\n' +
    '    <h4 class="modal-title">Edit Filter</h4>\n' +
    '  </div>\n' +
    '  <div class="modal-body">\n' +
    '    <div class="row filter-name-edit">\n' +
    '      <div class="col-xs-12">\n' +
    '        <div class="form-group">\n' +
    '          <label class="control-label col-xs-2">Filter Name</label>\n' +
    '          <div class="col-xs-10">\n' +
    '            <input type="text" data-ng-model="vm.filter.name" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="row">\n' +
    '      <div class="col-xs-offset-1 col-xs-10">\n' +
    '        <ul dnd-list="vm.filter.qualifications">\n' +
    '          <li data-ng-repeat="qualification in vm.filter.qualifications" dnd-draggable="qualification" dnd-moved="vm.filter.qualifications.splice($index, 1)" dnd-effect-allowed="move" class="filter-item">\n' +
    '            <div class="row">\n' +
    '              <div class="col-xs-10">\n' +
    '                <div class="form-group">\n' +
    '                  <label class="control-label col-xs-2">Field</label>\n' +
    '                  <div class="col-xs-10">\n' +
    '                    <input type="text" data-ng-model="qualification.field" class="form-control"/>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '                <div class="form-group">\n' +
    '                  <label class="control-label col-xs-2">Value</label>\n' +
    '                  <div class="col-xs-10">             \n' +
    '                    <input type="text" data-ng-model="qualification.value" class="form-control"/>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '              <div class="col-xs-2">\n' +
    '                <div class="filter-actions"><a href="" data-ng-click="vm.removeQualification($index)" class="btn btn-xs btn-link">Remove</a></div>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </li>\n' +
    '          <li>\n' +
    '            <div class="row">\n' +
    '              <div class="col-xs-10">\n' +
    '                <div class="form-group">\n' +
    '                  <label class="control-label col-xs-2">Field</label>\n' +
    '                  <div class="col-xs-10">\n' +
    '                    <input type="text" data-ng-model="vm.tmpQualification.field" placeholder="Qualification field..." required="" class="form-control"/>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '                <div class="form-group">\n' +
    '                  <label class="control-label col-xs-2">Value</label>\n' +
    '                  <div class="col-xs-10">\n' +
    '                    <input type="text" data-ng-model="vm.tmpQualification.value" placeholder="Qualification value..." required="" class="form-control"/>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '              <div class="col-xs-2">\n' +
    '                <button type="button" data-ng-disabled="newQualificationForm.$invalid" data-ng-click="vm.addQualification()" class="btn btn-sm btn-success">Add</button>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </li>\n' +
    '        </ul>\n' +
    '        <!--table.table.table-hover\n' +
    '        thead\n' +
    '          th Field\n' +
    '          th Value\n' +
    '          th &nbsp;\n' +
    '        tbody\n' +
    '          tr(data-ng-repeat="qualification in vm.filter.qualifications")\n' +
    '            td\n' +
    '              input.form-control(type="text",data-ng-model="qualification.field")\n' +
    '            td\n' +
    '              input.form-control(type="text",data-ng-model="qualification.value")\n' +
    '            td\n' +
    '              button.btn.btn-sm.btn-danger(type="button",data-ng-click="vm.removeQualification($index)")\n' +
    '                span.fa.fa-fw.fa-minus\n' +
    '          tr(data-ng-if="vm.filter.qualifications.length < 1")\n' +
    '            td(colspan="3") No qualifications defined for this filter.\n' +
    '        -->\n' +
    '        <!--form(name="newQualificationForm",data-ng-submit="vm.addQualification()")\n' +
    '        table.table\n' +
    '          tbody\n' +
    '            tr\n' +
    '              td\n' +
    '                input.form-control(type="text",data-ng-model="vm.tmpQualification.field",placeholder="Qualification field...",required="")\n' +
    '              td\n' +
    '                input.form-control(type="text",data-ng-model="vm.tmpQualification.value",placeholder="Qualification value...",required="")\n' +
    '              td\n' +
    '                button.btn.btn-sm.btn-success(type="submit",data-ng-disabled="newQualificationForm.$invalid")\n' +
    '                  span.fa.fa-fw.fa-plus\n' +
    '            \n' +
    '        -->\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="modal-footer">\n' +
    '    <button data-ng-click="$dismiss()" class="btn btn-link">Cancel</button>\n' +
    '    <button type="button" data-ng-click="vm.save()" class="btn btn-default">Done</button>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('kd.bundle.angular').run(['$templateCache', function($templateCache) {
  $templateCache.put('queue/setup/queue.setup.tpl.html',
    '\n' +
    '<div class="row">\n' +
    '  <div class="col-xs-12 col-md-4">\n' +
    '    <div><a href="" data-ng-click="vm.setup.doDefaults()" class="btn btn-default btn-block">Set Defaults</a><a href="" data-ng-click="vm.setup.save()" data-ng-disabled="vm.setup.isSetupValid()" class="btn btn-default btn-block">Save Changes</a><a href="" data-ui-sref="queue" class="btn btn-default btn-block">Go To Queue</a></div>\n' +
    '  </div>\n' +
    '  <div class="col-xs-12 col-md-8">\n' +
    '    <h3>Kapp Setup</h3>\n' +
    '    <div data-ng-if="vm.readyToEdit">\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-6">\n' +
    '          <div class="form-group">\n' +
    '            <label class="control-label">Queue Name</label>\n' +
    '            <input type="text" data-ng-model="vm.queueNameAttribute.values[0]" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="col-xs-6">\n' +
    '          <div class="form-group">\n' +
    '            <label class="control-label">Queue Type</label>\n' +
    '            <input type="text" data-ng-model="vm.queueTypeAttribute.values[0]" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-6">\n' +
    '          <div class="form-group">\n' +
    '            <label class="control-label">Queue Details Value</label>\n' +
    '            <input type="text" data-ng-model="vm.queueDetailsAttribute.values[0]" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="col-xs-6">\n' +
    '          <div class="form-group">\n' +
    '            <label class="control-label">Default Assigned Group</label>\n' +
    '            <input type="text" data-ng-model="vm.queueDefaultGroup.values[0]" class="form-control"/>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-12">\n' +
    '          <div class="form-group">\n' +
    '            <label class="control-label">Helper Kapp</label>\n' +
    '            <select data-ng-model="vm.helperKappAttribute.values[0]" data-ng-options="kapp.slug as kapp.name for kapp in vm.kapps" class="form-control"></select>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-12">\n' +
    '          <div class="panel panel-primary">\n' +
    '            <div class="panel-heading">\n' +
    '              <h3 class="panel-title">Initial Form Generation</h3>\n' +
    '            </div>\n' +
    '            <div class="panel-body">\n' +
    '              <div class="row">\n' +
    '                <div class="col-xs-4">\n' +
    '                  <div class="form-group">\n' +
    '                    <label class="control-label">Create Initial Form?\n' +
    '                      <input type="checkbox" data-ng-model="vm.setup.shouldCreateForm" class="form-control"/>\n' +
    '                    </label>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '                <div data-ng-if="vm.setup.shouldCreateForm" class="col-xs-8">\n' +
    '                  <div class="form-group">\n' +
    '                    <label class="control-label">Form Name</label>\n' +
    '                    <input type="text" data-ng-model="vm.setup.initialForm.name" class="form-control"/>\n' +
    '                  </div>\n' +
    '                  <div class="form-group">\n' +
    '                    <label class="control-label">Form Slug</label>\n' +
    '                    <input type="text" data-ng-model="vm.setup.initialForm.slug" class="form-control"/>\n' +
    '                  </div>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="row">\n' +
    '        <div class="col-xs-12">\n' +
    '          <div class="panel panel-primary">\n' +
    '            <div class="panel-heading">\n' +
    '              <h3 class="panel-title">Queue Filter Configuration</h3>\n' +
    '            </div>\n' +
    '            <div class="panel-body">\n' +
    '              <div class="row">\n' +
    '                <div class="col-xs-12">\n' +
    '                  <ul dnd-list="vm.queueFilterAttribute.values">\n' +
    '                    <li data-ng-repeat="filter in vm.queueFilterAttribute.values" dnd-draggable="filter" dnd-moved="vm.queueFilterAttribute.values.splice($index, 1)" dnd-effect-allowed="move" class="filter-item">\n' +
    '                       \n' +
    '                      {{filter.name}} \n' +
    '                      <div class="filter-actions btn-group pull-right"><a href="" data-ng-click="vm.setup.editFilter(filter)" class="btn btn-xs btn-primary"><span class="fa fa-fw fa-pencil"></span></a><a href="" data-ng-click="vm.setup.removeFilter($index)" class="btn btn-xs btn-danger"><span class="fa fa-fw fa-minus"></span></a></div>\n' +
    '                    </li>\n' +
    '                    <li>\n' +
    '                      <div class="row">\n' +
    '                        <div class="col-xs-11">\n' +
    '                          <input type="text" data-ng-model="vm.setup.tmpFilterName" placeholder="Queue Filter Name" class="form-control"/>\n' +
    '                        </div>\n' +
    '                        <div class="col-xs-1"><a href="" data-ng-click="vm.setup.addFilter()" class="btn btn-xs btn-success"> <i class="fa fa-fw fa-plus">      </i></a></div>\n' +
    '                      </div>\n' +
    '                    </li>\n' +
    '                  </ul>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);
