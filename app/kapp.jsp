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
    <!-- endinject -->

    <!-- inject:css -->
    <!-- endinject -->

    <!-- inject:vendor:js -->
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
    <!-- endinject -->

    <!-- Uncomment this to enable a local live reload for development -->
    <!-- script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script -->
  </body>
</html>
