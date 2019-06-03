

$(document).ready(function() {
  $.get('*', function(notifs) {
    notifs.forEach((noti) => {
      $( ".dropdown-item" ).append(
        `
          <div class="notifications">
            <p class="lead small"><img class="small-img" src="${noti.author.image.secure_url}" alt="${noti.author.username}"> ${noti.author.username} has posted a new blog <button type="button" class="ml-2 btn btn-sm btn-danger"><i class="fas fa-times"></i></button></p>
            <hr class="style-two">
          </div>
        `
      );
    })
  })
});
