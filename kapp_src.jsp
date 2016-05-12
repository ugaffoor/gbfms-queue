<%@taglib prefix="c"   uri="http://java.sun.com/jstl/core"  %>
<%@taglib prefix="app" uri="http://kineticdata.com/taglibs/core/app" %>
<!DOCTYPE html>
<html ng-app="kd.bundle.angular">
  <head>
    <title>Request CE</title>
    <!-- inject:vendor:css -->
    <!-- endinject -->

    <!-- inject:css -->
    <!-- endinject -->

    <app:headContent/>
  </head>
  <body>
    <div data-ui-view=""></div>

    <script>
      window.KD = window.KD || {};
      window.KD.context = '${pageContext.request.contextPath}';
      window.KD.space = '${space.slug}';
      window.KD.kapp = '${kapp.slug}';
      window.KD.base = KD.context + '/' + KD.space;

      window.KD.formsBase = window.KD.base + '/' + window.KD.kapp;
      window.KD.api = window.KD.base + '/app/api/v1';
      window.KD.bundleLocation = '${bundle.location}';
    </script>

    <!-- inject:vendor:js -->
    <!-- endinject -->

    <!-- inject:js -->
    <!-- endinject -->

    <script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
  </body>
</html>
