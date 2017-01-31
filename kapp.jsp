<%@include file="initialization.jspf" %>
<!DOCTYPE html>
<html ng-app="kd.bundle.angular">
  <head>
    <title></title>

    <!-- Specify content width scale for mobile devices and let the magic begin -->
    <meta content='width=device-width, initial-scale=1.0' name='viewport'>

    <!-- Kinops Favicons -->
    <link rel="apple-touch-icon" href="${bundle.location}/images/favicon-apple-touch-76x76.png" sizes="76x76">
    <link rel="icon" type="image/png" href="${bundle.location}/images/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="${bundle.location}/images/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="${bundle.location}/images/favicon-96x96.png" sizes="96x96">
    <link rel="shortcut icon" href="${bundle.location}/images/favicon.ico" type="image/x-icon"/>

    <!-- inject:vendor:css -->
    <link rel="stylesheet" href="${bundle.location}/dist/vendors/vendors.css">
    <!-- endinject -->

    <!-- inject:css -->
    <link rel="stylesheet" href="${bundle.location}/dist/css/assets/bundle.css">
    <link rel="stylesheet" href="${bundle.location}/dist/css/assets/styles.css">
    <!-- endinject -->

    <!-- inject:vendor:js -->
    <script src="${bundle.location}/dist/vendors/vendors.js"></script>
    <!-- endinject -->

    <app:headContent/>
  </head>
  <body>
    <c:import url="${headerPath}/partials/header.jsp" charEncoding="UTF-8"/>
    <div class="app-container" data-comment="top level view" data-ui-view=""></div>

    <c:import url="${footerPath}/partials/footer.jsp" charEncoding="UTF-8"/>

    <c:if test="${not empty responseServerUrl}">
      <script src="${responseServerUrl}/assets/response_bundle.js"></script>
      <script>
       bundle = bundle || {};
       bundle.config = bundle.config || {};
       bundle.config.queue = { response: true }
      </script>
    </c:if>
    
    <!-- inject:js -->
    <script src="${bundle.location}/dist/app/queue/setup/queue.setup.module.js"></script>
    <script src="${bundle.location}/dist/app/queue/setup/queue.setup.routes.js"></script>
    <script src="${bundle.location}/dist/app/queue/setup/queue.setup.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/setup/filter.qualification.controller.js"></script>
    <script src="${bundle.location}/dist/app/core/core.module.js"></script>
    <script src="${bundle.location}/dist/app/core/toast/toast.service.js"></script>
    <script src="${bundle.location}/dist/app/core/models/models.module.js"></script>
    <script src="${bundle.location}/dist/app/core/models/user.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/team.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/submission.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/space.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/kapp.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/form.types.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/form.model.js"></script>
    <script src="${bundle.location}/dist/app/core/models/attribute.definition.model.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/authentication.module.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/login.modal.service.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/login.modal.controller.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/login.controller.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/authentication.service.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/authentication.run.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/authentication.routes.js"></script>
    <script src="${bundle.location}/dist/app/core/authentication/authentication.config.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.module.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.work.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.summary.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.subtask.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.routes.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.new.item.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.list.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.detail.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.card.directive.js"></script>
    <script src="${bundle.location}/dist/app/queue/queue.assignment.controller.js"></script>
    <script src="${bundle.location}/dist/app/queue/items.service.js"></script>
    <script src="${bundle.location}/dist/app/queue/assignment.service.js"></script>
    <script src="${bundle.location}/dist/app/layout/layout.module.js"></script>
    <script src="${bundle.location}/dist/app/layout/layout.routes.js"></script>
    <script src="${bundle.location}/dist/app/layout/layout.public.controller.js"></script>
    <script src="${bundle.location}/dist/app/layout/layout.controller.js"></script>
    <script src="${bundle.location}/dist/app/errors/errors.module.js"></script>
    <script src="${bundle.location}/dist/app/errors/errors.routes.js"></script>
    <script src="${bundle.location}/dist/app/core/time.ago.js"></script>
    <script src="${bundle.location}/dist/app/core/slugifier.js"></script>
    <script src="${bundle.location}/dist/app/core/md5.js"></script>
    <script src="${bundle.location}/dist/app/core/kinetic.header.js"></script>
    <script src="${bundle.location}/dist/app/core/gravatar.js"></script>
    <script src="${bundle.location}/dist/app/core/fixedHeight.js"></script>
    <script src="${bundle.location}/dist/app/core/core.api.js"></script>
    <script src="${bundle.location}/dist/app/core/config.store.js"></script>
    <script src="${bundle.location}/dist/app/core/bundle.js"></script>
    <script src="${bundle.location}/dist/app/common/common.module.js"></script>
    <script src="${bundle.location}/dist/app/catalog/catalog.module.js"></script>
    <script src="${bundle.location}/dist/app/catalog/form.controller.js"></script>
    <script src="${bundle.location}/dist/app/catalog/catalog.routes.js"></script>
    <script src="${bundle.location}/dist/app/catalog/catalog.controller.js"></script>
    <script src="${bundle.location}/dist/app/app.js"></script>
    <script src="${bundle.location}/dist/app/bundle-templates.js"></script>
    <script src="${bundle.location}/dist/app/app.routes.js"></script>
    <script src="${bundle.location}/dist/app/app.constants.js"></script>
    <script src="${bundle.location}/dist/app/app.config.js"></script>
    <!-- endinject -->

    <!-- Uncomment this to enable a local live reload for development -->
    <!-- script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script -->
  </body>
</html>
