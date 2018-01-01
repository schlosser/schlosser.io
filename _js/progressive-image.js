(function (global) {
  'use strict';

  /**
   * Find the CSS transition end event that we should listen for.
   *
   * @returns {string} t - the transition string
   */
  function _whichTransitionEndEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      MSTransition: 'msTransitionEnd',
      OTransition: 'otransitionend',
      transition: 'transitionend',
    };
    for (t in transitions) {
      if (transitions.hasOwnProperty(t)) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }

  /**
   * This class manages a single image. It keeps track of the image's height,
   * width, and position in the grid. An instance of this class is associated
   * with a single image figure, which looks like this:
   *
   *   <figure class="progressive-image"
   *       data-small="..."
   *       data-medium="..."
   *       data-large="..."
   *       data-raw="...">
   *     <div class="aspect-ratio-holder" style="padding-bottom: ..."></div>
   *     <img class="thumbnail" src="..." alt="...">
   *   </figure>
   *
   * @param {element} figure - the <figure> DOM element.
   * @returns {object} the progressive image object
   */
  function ProgressiveImage(figure) {
    this.id = "viewer-" + Math.round(Math.random()*Math.pow(10,6)).toString();
    this.viewerOpen = false;
    this.figure = figure;
    this.scrim = document.getElementsByClassName('scrim')[0];
    this.lastWindowWidth = window.innerWidth;
    this.transitionEndEvent = _whichTransitionEndEvent();
    this.forceSmall = (this.figure.className.indexOf('force-small') >= 0);
    this.forceMedium = (this.figure.className.indexOf('force-medium') >= 0);
    this.forceLarge = (this.figure.className.indexOf('force-large') >= 0);
    window.addEventListener('keyup', function(e) {
      if (e.keyCode === 27 /* ESC */) {
        this.closeViewer();
      }
    }.bind(this));
    this.load();

    if (this.figure.className.indexOf('with-viewer') >= 0) {
      this.figure.addEventListener('click', this.openViewer.bind(this));
    }

    return this;
  }

  ProgressiveImage.prototype.closeViewer = function () {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onShouldCloseViewer);
    window.removeEventListener('orientationchange', this.onShouldCloseViewer);
    this.scrim.removeEventListener('click', this.onShouldCloseViewer);

    this.figure.addEventListener(this.transitionEndEvent, function () {
      if (document.body.className.indexOf(this.id) == -1) {
        this.viewerOpen = false;
        this.figure.className = this.figure.className
          .replace('is-open', '')
          .replace(/^\s+|\s+$/g, '');
        this.figure.style.zIndex = '';
      }
    }.bind(this));

    // Begin transition
    document.body.className = document.body.className
      .replace(this.id, '')
      .replace(/^\s+|\s+$/g, '');
    this.figure.style.transform = '';
  };

  ProgressiveImage.prototype.openViewer = function () {
    if (document.body.className.indexOf(this.id) >= 0) {
      this.closeViewer();
      return;
    }

    this.viewerOpen = true;

    // Initial Values
    var figureStyle = window.getComputedStyle(this.figure);
    var initialHeight = parseFloat(figureStyle.height);
    var initialWidth = parseFloat(figureStyle.width);
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var figureBoundingRect = this.figure.getBoundingClientRect();

    // Computed Values
    var figureAspectRatio = initialWidth / initialHeight;
    var windowAspectRatio = windowWidth / windowHeight;
    var scale;
    var translateX;
    var translateY;

    if (windowAspectRatio >= figureAspectRatio) {
      // Image will fill up vertical space
      scale = windowHeight / initialHeight;
      var finalWidth = initialWidth * scale;
      translateX = (windowWidth - finalWidth) / 2 - figureBoundingRect.left;
      translateY = figureBoundingRect.top * -1;

    } else {
      // Image will fill up horizontal space
      scale = windowWidth / initialWidth;
      var finalHeight = initialHeight * scale;
      translateY = (windowHeight - finalHeight) / 2 - figureBoundingRect.top;
      translateX = figureBoundingRect.left * -1;
    }

    // Apply DOM transformations
    document.body.className += ' ' + this.id;
    this.figure.className += ' is-open';
    this.figure.style.zIndex = '800';
    this.figure.style.transform = 'translate3d(' + translateX + 'px,' +
      translateY + 'px,0) scale(' + scale + ')';

    // Load Raw Image (large!)
    setTimeout(function () {
      if (this.figure.className.indexOf('loaded-raw') <= 0) {
        // There is a larger image to load.
        this.loadRaw();
      }
    }.bind(this), 300);

    this.onScroll = function () {
      var offset = this.figure.getBoundingClientRect().top;
      if (Math.abs(offset) > 50) {
        this.closeViewer();
      }
    }.bind(this);

    this.onShouldCloseViewer = function (e) {
      this.closeViewer();
      e.stopPropagation();
    }.bind(this);

    this.scrim.addEventListener('click', this.onShouldCloseViewer);
    window.addEventListener('resize', this.onShouldCloseViewer);
    window.addEventListener('orientationchange', this.onShouldCloseViewer);
    window.addEventListener('scroll', this.onScroll);
  };

  /**
   * Load the full image element into the DOM.
   */
  ProgressiveImage.prototype.load = function () {
    // Create a new image element, and insert it into the DOM.
    var fullImage = new Image();
    fullImage.src = this.figure.dataset[this.getSize()];
    fullImage.className = 'full';
    fullImage.onload = function () {
      this.figure.className += ' loaded';
    }.bind(this);

    this.figure.appendChild(fullImage);
  };

  /**
   * Load the raw image element into the DOM.
   */
  ProgressiveImage.prototype.loadRaw = function () {
    // Create a new image element, and insert it into the DOM.
    var rawImage = new Image();

    // not actually raw, because damn, that's expensive.
    rawImage.src = this.figure.dataset.raw;
    rawImage.className = 'raw';
    rawImage.onload = function () {
      this.figure.className += ' loaded-raw';
    }.bind(this);

    this.figure.appendChild(rawImage);
  };

  /**
   * Choose the size of image to load based on the window width.
   */
  ProgressiveImage.prototype.getSize = function () {
    if (this.forceSmall) {
      return 'small';
    } else if (this.forceMedium) {
      return 'medium';
    } else if (this.forceLarge) {
      return 'large';
    }

    var sizes = ['small', 'medium', 'large'];
    var sizeIndex;
    if (this.lastWindowWidth < 768) {
      sizeIndex = 0; // small
    } else if (this.lastWindowWidth < 1440) {
      sizeIndex = 1; // medium
    } else {
      sizeIndex = 2; // large;
    }

    // Retina devices should have larger pixel densities.
    if (window.devicePixelRatio > 1 && sizeIndex < 2) {
      sizeIndex += 1;
    }

    return sizes[sizeIndex];
  };

  // Export ProgressiveImage into the global scope.
  if (typeof define === 'function' && define.amd) {
    define(ProgressiveImage);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveImage;
  } else {
    global.ProgressiveImage = ProgressiveImage;
  }

}(this));
