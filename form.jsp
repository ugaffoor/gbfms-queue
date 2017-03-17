<%@page pageEncoding="UTF-8" contentType="text/html" trimDirectiveWhitespaces="true"%>
<%@taglib prefix="app" uri="http://kineticdata.com/taglibs/core/app" %>
<%@taglib prefix="bundle" uri="http://kineticdata.com/taglibs/bundle" %>
<%
    request.setAttribute("json", new com.kineticdata.bundles.JsonHelper());
    request.setAttribute("text", new com.kineticdata.bundles.TextHelper());
    request.setAttribute("time", new com.kineticdata.bundles.TimeHelper());
%>
<script>
  // Initialize Bootstrappy field overrides.
  bundle.config.fields = {
    text: function(field, triggerFn) {
      $(field.wrapper()).addClass('form-group');
      $(field.wrapper()).find('label').addClass('control-label');
        $(field.element()).addClass('form-control');
      $(field.element()).on('change', triggerFn);
    },
    dropdown: function(field, triggerFn) {
      $(field.wrapper()).addClass('form-group');
      $(field.wrapper()).find('label').addClass('control-label');
      $(field.element()).addClass('form-control');
      $(field.element()).on('change', triggerFn);
    }
  //   checkbox: function(field, triggerFn) {
  //     $(field.element()).on('change', triggerFn);
  //     $(field.wrapper()).find('label[for]').each(function() {
  //       $('<p/>')
  //         .append($(this).find('input'))
  //         .append($(this))
  //         .appendTo($(field.wrapper()));
  //     });
  //   },
  //   radio: function(field, triggerFn) {
  //     $(field.element()).on('change', triggerFn);
  //     $(field.wrapper()).find('label[for]').each(function() {
  //       $('<p/>')
  //         .append($(this).find('input'))
  //         .append($(this))
  //         .appendTo($(field.wrapper()));
  //     });
  //   }
  };
  bundle.config.ready = function() {
    $('[data-element-type="button"]').addClass('btn btn-default');
  };
</script>
<section class="page" data-page="${page.name}">
  <c:if test="${param.review != null && pages.size() > 1}">
    <c:import url="partials/review.jsp" charEncoding="UTF-8"></c:import>
  </c:if>
  <app:bodyContent/>
</section>
