require('es6-object-assign').polyfill();
require('es6-promise').polyfill();

import 'bootstrap/dist/css/bootstrap.css';

import '../app/assets/styles.scss';

import '../app/app';
import '../app/app.routes';
import '../app/app.config';
import '../app/app.constants';
import '../app/common/common.module';
import '../app/core/core.module';
import '../app/core/toast/toast.service';
import '../app/core/bundle';
import '../app/core/config.store';
import '../app/core/core.api';
//import '../app/core/fixedHeight';
import '../app/core/gravatar';
import '../app/core/kinetic.header';
import '../app/core/slugifier';
import '../app/core/status.label';
import '../app/core/time.ago';
import '../app/core/authentication/authentication.module';
import '../app/core/authentication/authentication.config';
import '../app/core/authentication/authentication.routes';
import '../app/core/authentication/authentication.run';
import '../app/core/authentication/authentication.service';
import '../app/core/authentication/login.controller';
import '../app/core/authentication/login.modal.controller';
import '../app/core/authentication/login.modal.service';
import '../app/core/models/models.module';
import '../app/core/models/attribute.definition.model';
import '../app/core/models/form.model';
import '../app/core/models/form.types.model';
import '../app/core/models/kapp.model';
import '../app/core/models/space.model';
import '../app/core/models/submission.model';
import '../app/core/models/team.model';
import '../app/core/models/user.model';
import '../app/errors/errors.module';
import '../app/errors/errors.routes';
import '../app/layout/layout.module';
import '../app/layout/layout.routes';
import '../app/layout/layout.controller';
import '../app/layout/layout.public.controller';

import '../app/queue/queue.module';
import '../app/queue/queue.routes';
import '../app/queue/assignment.service';
import '../app/queue/form.assignment.component';
import '../app/queue/items.service';
import '../app/queue/queue.controller';
import '../app/queue/queue.discussion.controller';
import '../app/queue/queue.assignment.controller';
import '../app/queue/queue.list.controller';
import '../app/queue/queue.detail.controller';
import '../app/queue/queue.summary.controller';
import '../app/queue/queue.subtask.controller';
import '../app/queue/queue.work.controller';
import '../app/queue/queue.new.item.controller';
import '../app/queue/queue.new.list.controller';
import '../app/queue/queue.new.item.modal.controller';
import '../app/queue/queue.card.directive';

import '../app/queue/setup/queue.setup.module';
import '../app/queue/setup/queue.setup.routes';
import '../app/queue/setup/queue.setup.controller';
import '../app/queue/setup/filter.qualification.controller';

const root = document.getElementById('root');
angular.bootstrap(document.getElementById('root'), ['kd.bundle.angular'], {
  strictDi: true
});
