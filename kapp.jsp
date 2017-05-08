<%@include file="initialization.jspf" %>
<%-- Here we check for a request header that tells us whether or not the request was made via webpack proxy server.
     If it is we do not want to use the bundle location in the static path because the webpack dev server will be
     serving resources from /static.  If the header is not present we want to prefix the /static path with the
     bundle location because that is where they will be served from the core web server. --%>
<c:set var="bundlePath" value="${empty pageContext.request.getHeader('X-From-Webpack-Proxy') ? bundle.location : '' }" />
<!DOCTYPE html>
<html>
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

    <c:import url="${librariesPath}/partials/libraries.jsp" charEncoding="UTF-8" />

    <app:headContent/>

    <style>
      .kd-cloak {
        display: none;
      }
    </style>
  </head>
  <body>
    <!-- Need these to make the shared space header footer work. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.4.js"></script>
    <!-- script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script -->

    <!-- Import the shared header and footer around the div where the Queue app will render. -->
    <div class="kd-cloak">
      <c:import url="${headerPath}/partials/header.jsp" charEncoding="UTF-8" />
    </div>
    <div id='root'>
      <div class="app-container" data-comment="top level view" data-ui-view=""></div>
    </div>
    <div class="kd-cloak">
      <c:import url="${footerPath}/partials/footer.jsp" charEncoding="UTF-8" />
    </div> 

    <!-- If the Discussion Server has been configured, load its code and initialize the configuration -->
    <c:if test="${not empty discussionServerUrl}">
      <script src="${headerLocation}/js/response_bundle.js"></script>
      <script>
        bundle = bundle || {};
        bundle.config = bundle.config || {};
        bundle.config.queue = { discussion: true }
      </script>
    </c:if>

    <!-- Load the Queue code bundle. -->
    <script src="${bundlePath}/static/bundle.js"></script>
  </body>
</html>
