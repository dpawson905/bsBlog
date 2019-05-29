/*global $:true, jQuery:true */

function checkPasswordMatch() {
  var password = $('#password').val();
  var confirmPassword = $('#password2').val();

  if (password != confirmPassword)
    $('#checkPw').addClass('form-error').removeClass('form-success').html('Passwords do not match!');
  else
    $('#checkPw').addClass('form-success').removeClass('form-error').html('Passwords match.');
}

$(document).ready(function () {
  $(document).scroll(function () {
    var $nav = $(".fixed-top");
    var $nav1 = $(".fixed-bottom");
    var $navHeight = $(".header-img");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $navHeight.height() - 50);
    $nav1.toggleClass('scrolled', $(this).scrollTop() > $nav1.height());
  });

  $('#password2, #checkPw').keyup(checkPasswordMatch);

  // window.setTimeout(function () {
  //   $('.toast')
  //     .fadeTo(100, 0)
  //     .slideUp(500, function () {
  //       $(this).remove();
  //     });
  // }, 10000);
});
