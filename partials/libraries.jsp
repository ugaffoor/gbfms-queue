<%@page pageEncoding="UTF-8" contentType="text/html" trimDirectiveWhitespaces="true"%>
<%@include file="../initialization.jspf" %>

<%-- font-awesome.css is incompatible with the bundle:stylepack due to font files. --%>
<link href="${librariesLocation}/libraries/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css"/>

<bundle:stylepack>
    <%-- CSS files included in the stylepack will be combined and minified into one file --%>
    <bundle:style src="${librariesLocation}/libraries/bootstrap/css/bootstrap.css" />
    <bundle:style src="${librariesLocation}/libraries/bootstrap-select/bootstrap-select.css" />
    <bundle:style src="${librariesLocation}/libraries/datatables/datatables.css"/>
    <bundle:style src="${librariesLocation}/libraries/animate/animate.css" />
    <bundle:style src="${librariesLocation}/libraries/kd-typeahead/kd-typeahead.css"/>
    <bundle:style src="${librariesLocation}/libraries/notifie/jquery.notifie.css" />
</bundle:stylepack>

<%-- moment-with-locales.js is incompatible with the bundle:scriptpack minification process. --%>
<bundle:scriptpack minify="false">
    <bundle:script src="${librariesLocation}/libraries/moment/moment-with-locales.min.js"/>
</bundle:scriptpack>

<bundle:scriptpack>
    <%-- JS files included in the scriptpack will be combined and minified into one file --%>
    <bundle:script src="${librariesLocation}/libraries/jquery/jquery.js" />
    <bundle:script src="${librariesLocation}/libraries/underscore/underscore.js" />
    <bundle:script src="${librariesLocation}/libraries/bootstrap/js/bootstrap.js" />
    <bundle:script src="${librariesLocation}/libraries/moment/moment-timezone.js" />
    <bundle:script src="${librariesLocation}/libraries/datatables/datatables.js"/>
    <bundle:script src="${librariesLocation}/libraries/typeahead/typeahead.js" />
    <bundle:script src="${librariesLocation}/libraries/bootstrap-select/bootstrap-select.js" />
    <bundle:script src="${librariesLocation}/libraries/kd-typeahead/kd-typeahead.js" />
    <bundle:script src="${librariesLocation}/libraries/kd-subforms/kd-subforms.js"/>
    <bundle:script src="${librariesLocation}/libraries/kd-dataviewer/dataviewer.js" />
    <bundle:script src="${librariesLocation}/libraries/md5/md5.js" />
    <bundle:script src="${librariesLocation}/libraries/notifie/jquery.notifie.js" />
</bundle:scriptpack>