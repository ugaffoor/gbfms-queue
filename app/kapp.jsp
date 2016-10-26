<%@include file="initialization.jspf" %>
<!DOCTYPE html>
<html ng-app="kd.bundle.angular">
  <head>
    <title>Request CE</title>

    <!-- Specify content width scale for mobile devices and let the magic begin -->
    <meta content='width=device-width, initial-scale=1.0' name='viewport'>

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

    <!-- One the footer is completed we'll uncomment this. -->
    <!-- c:import url="${footerPath}/partials/footer.jsp" charEncoding="UTF-8"/ -->
    <!-- inject:js -->
    <!-- endinject -->

    <!-- Uncomment this to enable a local live reload for development -->
    <!-- script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script -->
  </body>
</html>
