(function(global) {
  'use strict';

  /**
   * This class manages a single image. It keeps track of the image's height,
   * width, and position in the grid. An instance of this class is associated
   * with a single image figure, which looks like this:
   *
   *   <figure class="progressive-image"
   *       data-small="..."
   *       data-medium="..."
   *       data-large="...">
   *     <div class="aspect-ratio-holder" style="padding-bottom: ..."></div>
   *     <img class="thumbnail" src="..." alt="...">
   *   </figure>
   *
   * @param {element} figure - the <figure> DOM element.
   * @returns {object} the progressive image object
   */
  function ProgressiveImage(figure) {
    this.figure = figure;
    this.lastWindowWidth = window.innerWidth;
    this.load();
    return this;
  }

  /**
   * Load the full image element into the DOM.
   */
  ProgressiveImage.prototype.load = function() {
    // Create a new image element, and insert it into the DOM.
    var fullImage = new Image();
    fullImage.src = this.figure.dataset[this.getSize()];
    fullImage.onload = function() {
      this.figure.className += ' loaded';
    }.bind(this);

    this.figure.appendChild(fullImage);
  };

  /**
   * Choose the size of image to load based on the window width.
   */
  ProgressiveImage.prototype.getSize = function() {
    console.log(this.lastWindowWidth);
    if (this.lastWindowWidth < 768) {
      return 'small';
    } else if (this.lastWindowWidth < 1440) {
      return 'medium';
    } else {
      return 'large';
    }
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
