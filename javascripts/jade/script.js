$(function() {
  var isFixed, jade2html, navTop, update;
  jade2html = function(input, data) {
    return jade.compile(input, {
      pretty: true,
      doctype: "5"
    })(data);
  };
  update = function($jade) {
    var $data, $html, $iframe, data, html, input, json;
    $data = $jade.siblings(".json");
    json = $data.val() || "{}";
    $html = $jade.closest("div").find("textarea.html");
    $iframe = $jade.closest("div").find("iframe");
    $jade.closest("div").find("textarea").removeClass("error");
    try {
      data = JSON.parse(json);
    } catch (error) {
      $data.addClass("error");
      $html.val("[json] " + error.message).addClass("error");
      return;
    }
    input = $jade.val();
    try {
      console.log(input);
      html = jade2html(input, data);
    } catch (error) {
      $jade.addClass("error");
      $html.val("[jade] " + error.message).addClass("error");
      return;
    }
    html = html.trim();
    $html.val(html);
    if ($iframe.length) {
      $iframe.contents().find('body').html(html);
    } else {
      console.log('nyet');
    }
  };
  $("textarea.jade").each(function() {
    return update($(this).on("keyup", function() {
      return update($(this));
    }));
  });
  $("textarea.json").on("keyup", function() {
    return update($(this).siblings(".jade"));
  });
  $.fn.tabOverride.autoIndent = true;
  $.fn.tabOverride.tabSize(2);
  $("textarea").tabOverride();
  navTop = $('.subnav').length && $('.subnav').offset().top;
  isFixed = 0;
  return $(window).on("scroll", function() {
    var i, scrollTop;
    i = void 0;
    scrollTop = $(window).scrollTop();
    if (scrollTop >= navTop && !isFixed) {
      isFixed = 1;
      return $('.subnav').addClass("subnav-fixed");
    } else if (scrollTop <= navTop && isFixed) {
      isFixed = 0;
      return $('.subnav').removeClass("subnav-fixed");
    }
  });
});