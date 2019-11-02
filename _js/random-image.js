document.addEventListener('DOMContentLoaded', function() {
  photoKeys = Object.keys(TRAVEL_PHOTOS);

  function injectRandomPhotos() {
    figures = document.getElementsByClassName('figure-placeholder');
    [].forEach.call(figures, function(fig) {
      var randomPhotoKey = photoKeys[Math.floor(Math.random() * photoKeys.length)];
      var randomPhoto = TRAVEL_PHOTOS[randomPhotoKey];
      var page = TRAVEL_PAGES[randomPhoto.pageKey];
      fig.innerHTML = (
        '<a href="' + page + '#' + randomPhoto.hash + '">' +
          '<i style="background-image:url(\'/img/res/400/' + randomPhotoKey + '\')"></i>' +
        '</a>');
    });
  }

  shuffleButton = document.getElementById('shuffle-button');
  shuffleButton.addEventListener('click', injectRandomPhotos);
  injectRandomPhotos();
});
