<%@include file="initialization.jspf" %>
<!DOCTYPE html>
<html ng-app="kd.bundle.angular">
  <head>
    <title></title>

    <!-- Specify content width scale for mobile devices and let the magic begin -->
    <meta content='width=device-width, initial-scale=1.0' name='viewport'>

    <!-- Kinops Favicons -->
    <!-- Chrome Toolbar Color -->
    <meta content='#ff7700' name='theme-color'>
    <meta content='yes' name='mobile-web-app-capable'>
    <meta content='Kinetic Data, Inc.' name='application-name'>
    <link href="${bundle.location}/images/touch/homescreen192.png" rel="icon" type="image/png" sizes="192x192" />
    <meta content='no' name='apple-mobile-web-app-capable'>
    <meta content='black' name='apple-mobile-web-app-status-bar-style'>
    <meta content='Kinetic Data, Inc.' name='apple-mobile-web-app-title'>
    <!-- Touch Icons -->
    <link href="${bundle.location}/images/touch/homescreen72-fav.png" rel="shortcut icon" type="image/png" />
    <link href="${bundle.location}/images/touch/homescreen48.png" rel="apple-touch-icon" type="image/png" />
    <link href="${bundle.location}/images/touch/homescreen72.png" rel="apple-touch-icon" type="image/png" sizes="72x72" />
    <link href="${bundle.location}/images/touch/homescreen96.png" rel="apple-touch-icon" type="image/png" sizes="96x96" />
    <link href="${bundle.location}/images/touch/homescreen144.png" rel="apple-touch-icon" type="image/png" sizes="144x144" />
    <link href="${bundle.location}/images/touch/homescreen192.png" rel="apple-touch-icon" type="image/png" sizes="192x192" />
    <link href="${bundle.location}/images/touch/safari-pinned-tab.svg" rel="mask-icon" type="image/svg" color="#ff7700" />
    <!-- Windows Tile Image -->
    <meta content='${bundle.location}/images/touch/homescreen144.png' name='msapplication-TileImage'>
    <meta content='#ff7700' name='msapplication-TileColor'>
    <meta content='no' name='msapplication-tap-highlight'>
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

    <c:if test="${not empty discussionServerUrl}">
      <script src="${discussionServerUrl}/assets/response_bundle.js"></script>
      <script>
       bundle = bundle || {};
       bundle.config = bundle.config || {};
       bundle.config.queue = { discussion: true }
      </script>
    </c:if>

    <!-- inject:js -->
    <!-- endinject -->

    <!-- Uncomment this to enable a local live reload for development -->
    <!-- script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script -->
  </body>
</html>
