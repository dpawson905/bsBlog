/*global $:true, jQuery:true */

function checkPasswordMatch() {
  var password = $("#password").val();
  var confirmPassword = $("#password2").val();

  if (password != confirmPassword)
    $("#checkPw")
      .addClass("form-error")
      .removeClass("form-success")
      .html("Passwords do not match!");
  else
    $("#checkPw")
      .addClass("form-success")
      .removeClass("form-error")
      .html("Passwords match.");
}

var $nav = $(".fixed-top");
var $nav1 = $(".fixed-bottom");
var $navHeight = $(".header-img");
var $profileHeight = $(".profile-hero");

$(document).ready(function() {
  $(document).scroll(function() {
    $nav.toggleClass(
      "scrolled",
      $(this).scrollTop() > $navHeight.height() - 50
    );
    $nav.toggleClass(
      "scrolled",
      $(this).scrollTop() > $profileHeight.height() - 100
    );
    $nav1.toggleClass("scrolled", $(this).scrollTop() > $nav1.height());
  });

  $("#password2, #checkPw").keyup(checkPasswordMatch);

  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
  }

  window.setTimeout(function () {
    $('.toast')
      .slideUp(500, function () {
        $(this).remove();
      });
  }, 10000);
});
