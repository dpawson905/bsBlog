$(document).ready(function () {
  $(document).scroll(function () {
    var $nav = $(".fixed-top");
    var $navHeight = $(".header-img")
    $nav.toggleClass('scrolled', $(this).scrollTop() > $navHeight.height() - 20);
  });

  window.setTimeout(function () {
    $('.alert')
      .fadeTo(100, 0)
      .slideUp(500, function () {
        $(this).remove();
      });
  }, 10000);

  new Typed('.typed', {
    strings: [`Welcome to SimpleBlog`],
    typeSpeed: 60,
    startDelay: 100,
    contentType: 'html'
  });
});
