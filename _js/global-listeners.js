function _addClass(e, c) {
 e.className = e.className.replace(c, '').replace('  ', ' ').trim() + ' ' + c;
}

function _removeClass(e, c) {
 e.className = e.className.replace(c, '').replace('  ', ' ').trim();
}


document.addEventListener('DOMContentLoaded', function() {
  var body = document.getElementsByTagName('body')[0];
  var html = document.getElementsByTagName('html')[0];
  var wordState = 0;

  function enableDarkMode() {
    _addClass(body, 'dark-mode');
    html.style.backgroundColor = '#000000';
    localStorage.setItem("mode", "dark");
  }

  function disableDarkMode() {
    _removeClass(body, 'dark-mode');
    html.style.backgroundColor = '';
    localStorage.removeItem("mode");
  }

  function enableImageLinks() {
    _addClass(body, 'show-image-links');
  }

  function disableImageLinks() {
    _removeClass(body, 'show-image-links');
  }

  if (localStorage.getItem("mode") === "dark") {
    enableDarkMode();
  }

  document.addEventListener('keyup', function(e) {
    switch(e.which) {
      case 16: // "shift"
      case 18: // "alt"
      case 91: // "cmd"
        disableImageLinks();
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

  document.addEventListener('keydown', function(e) {
    switch (e.which) {
      case 16: // "shift"
      case 18: // "alt"
      case 91: // "cmd"
        enableImageLinks();
        console.log("hi");
        break;
      default:
        break;
    }
  });
});
