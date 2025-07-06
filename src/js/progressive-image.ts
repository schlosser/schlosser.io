export default class ProgressiveImage {
  id: string;
  viewerOpen: boolean;
  figure: HTMLElement;
  scrim: HTMLDivElement;
  selfLink: HTMLAnchorElement;
  selfLinkText: HTMLElement;
  lastWindowWidth: number;
  transitionEndEvent: string;
  forceSmall: boolean;
  forceMedium: boolean;
  forceLarge: boolean;
  onScroll?: () => void;
  onShouldCloseViewer?: (e: Event) => void;

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
  constructor(figure: HTMLElement) {
    this.id =
      "viewer-" + Math.round(Math.random() * Math.pow(10, 6)).toString();
    this.viewerOpen = false;
    this.figure = figure;
    this.scrim = document.getElementsByClassName("scrim")[0] as HTMLDivElement;
    this.selfLink = figure.getElementsByClassName("self-link")[0] as HTMLAnchorElement;
    this.selfLinkText =
      this.selfLink && this.selfLink.getElementsByTagName("label")[0];
    this.lastWindowWidth = window.innerWidth;
    this.transitionEndEvent = 'transitionend';
    this.forceSmall = this.figure.className.indexOf("force-small") >= 0;
    this.forceMedium = this.figure.className.indexOf("force-medium") >= 0;
    this.forceLarge = this.figure.className.indexOf("force-large") >= 0;
    const me = this;
    window.addEventListener(
      "keyup",
      function (e) {
        if (e.keyCode === 27 /* ESC */) {
          me.closeViewer();
        }
      }
    );

    if (this.figure.className.indexOf("with-viewer") >= 0) {
      this.figure.addEventListener("click", this.openViewer.bind(this));
    }

    if (this.selfLink) {
      this.selfLink.addEventListener(
        "click",
        this.copyLinkToClipboard.bind(this)
      );
    }

    return this;
  }


  /**
   * Copy text to clipboard, while retaining the existing document selection.
   * Copied from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
   *
   * @param {string} str - the text to copy to the user's clipboard.
   */
  _copyToClipboard(str: string) {
    var el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selection = document.getSelection();
    var selected =
      selection && selection.rangeCount > 0
        ? selection.getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected && selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }
  }

  copyLinkToClipboard(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this._copyToClipboard(this.selfLink?.href ?? '');
    var oldText = this.selfLinkText.textContent;
    this.selfLinkText.textContent = "Copied!";
    const me = this;
    setTimeout( () =>  {
        me.selfLinkText.textContent = oldText;
      },
      10 * 1000
    );
  };

  closeViewer () {
    if (this.onScroll) {
      window.removeEventListener("scroll", this.onScroll);
    }
    if (this.onShouldCloseViewer) {
      window.removeEventListener("resize", this.onShouldCloseViewer);
      window.removeEventListener("orientationchange", this.onShouldCloseViewer);
      this.scrim.removeEventListener("click", this.onShouldCloseViewer);
    }

    const me = this;
    this.figure.addEventListener(
      this.transitionEndEvent,
      function () {
        if (document.body.className.indexOf(me.id) == -1) {
          me.viewerOpen = false;
          const closest = me.figure.closest("section");
          if (closest) {
            closest.style.contentVisibility = "auto";
          }
          me.figure.className = me.figure.className
            .replace("is-open", "")
            .replace(/^\s+|\s+$/g, "");
          me.figure.style.zIndex = "";
        }
      }.bind(this)
    );

    // Begin transition
    document.body.className = document.body.className
      .replace(this.id, "")
      .replace(/^\s+|\s+$/g, "");
    this.figure.style.transform = "";
  };

  openViewer () {
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

    try {
      const closest = this.figure.closest("section");
      if (closest) {
        closest.style.contentVisibility = "visible";
      }
    } catch (error) {
      console.error(error);
    }

    // Apply DOM transformations
    document.body.className += " " + this.id;
    this.figure.className += " is-open";
    this.figure.style.zIndex = "800";
    this.figure.style.transform =
      "translate3d(" +
      translateX +
      "px," +
      translateY +
      "px,0) scale(" +
      scale +
      ")";


    const me = this;
    this.onScroll = function () {
      var offset = me.figure.getBoundingClientRect().top;
      if (Math.abs(offset) > 50) {
        me.closeViewer();
      }
    };

    this.onShouldCloseViewer = function (e) {
      me.closeViewer();
      e.stopPropagation();
    };

    this.scrim?.addEventListener("click", this.onShouldCloseViewer);
    window.addEventListener("resize", this.onShouldCloseViewer);
    window.addEventListener("orientationchange", this.onShouldCloseViewer);
    window.addEventListener("scroll", this.onScroll);
  };

  /**
   * Choose the size of image to load based on the window width.
   */
  getSize(): string {
    if (this.forceSmall) {
      return "small";
    } else if (this.forceMedium) {
      return "medium";
    } else if (this.forceLarge) {
      return "large";
    }

    var sizes = ["small", "medium", "large"];
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
}
