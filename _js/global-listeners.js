document.addEventListener('DOMContentLoaded', function() {
  var body = document.getElementsByTagName('body')[0];
  var html = document.getElementsByTagName('html')[0];
  var wordState = 0;
  var showingImageLinks = false;

  function enableDarkMode() {
    // Avoids double dark mode... ;)
    body.className = body.className.replace(' dark-mode', '');
    body.className += ' dark-mode';
    html.style.backgroundColor = '#000000';
    localStorage.setItem("mode", "dark");
  }

  function disableDarkMode() {
    body.className = body.className.replace(' dark-mode', '');
    html.style.backgroundColor = '';
    localStorage.removeItem("mode");
  }

  function toggleImageLinks() {
    body.className = body.className.replace(' show-image-links', '');
    showingImageLinks = !showingImageLinks;

    if (showingImageLinks) {
      body.className += ' show-image-links';
    }
  }

  if (localStorage.getItem("mode") === "dark") {
    enableDarkMode();
  }

  document.addEventListener('keyup', function(e) {
    switch(e.which) {
      case 16: // "shift"
        toggleImageLinks();
        break;
      case 68: // "d"
        wordState = 1;
        break;
      case 65: // "a"
        wordState = (wordState === 1) ? 2 : 0;
        break;
      case 82: // "r"
        wordState = (wordState === 2) ? 3 : 0;
        break;
      case 75: // "k"
        if (wordState === 3) {
          enableDarkMode();
        }
        wordState = 0;
        break;
      case 76: // "l"
        wordState = 10;
        break;
      case 73: // "i"
        wordState = (wordState === 10) ? 20 : 0;
        break;
      case 71: // "g"
        wordState = (wordState === 20) ? 30 : 0;
        break;
      case 72: // "h"
        wordState = (wordState === 30) ? 40 : 0;
        break;
      case 84: // "t"
        if (wordState === 40) {
          disableDarkMode();
        }
        wordState = 0;
        break;
      default:
        wordState = 0;
        break;
    }
  });
});
