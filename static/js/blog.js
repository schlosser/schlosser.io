$(window).bind("load", function() {
	var $title = $(".site-title"),
		$titleSpacer = $(".title-spacer"),
		$fragmentFirst = $(".fragment-first"),
		$fragmentLast = $(".fragment-last"),
		$fragmentFirstInnerText = $(".fragment-first span"),
		$fragmentLastInnerText = $(".fragment-last span"),
		$fragmentNBSP = $(".fragment-nbsp"),
		nbspWidth = function() {
			return calculateWordWidth("&nbsp;", ["site-title"]);
		},
		titleFinalWidth = function () {
			return	calculateWordWidth("D", ["text-links"]) +
				calculateWordWidth("R", ["text-links"]) +
				calculateWordWidth("S", ["text-links"]);
		},
		fragmentFirstOriginalWidth = function() {
			if ($(window).width() < 1024) {
				return "auto";
			}
			return calculateWordWidth($fragmentFirstInnerText.text(), ["site-title"]);
		},
		fragmentLastOriginalWidth = function() {
			if ($(window).width() < 1024) {
				return "auto";
			}
			return calculateWordWidth($fragmentLastInnerText.text(), ["site-title"]);
		},
		titleOriginalWidth = function() {
			return $("body").width();
		},
		titleOriginalFontSize = function() {
			return 4.75;
		},
		titleFinalFontSize = function() {
			return 1.5;
		},
		titleOriginalHeight = function() {
			return 6;
		},
		titleFinalHeight = function() {
			return 3.5;
		};

	$("a[href='#top']").click(function (e) {
		$("html, body").animate({ scrollTop: 0 }, "fast", function() {
			updateTitle();
		});
		return false;
	});

	$fragmentFirstInnerText.css({"width": fragmentFirstOriginalWidth()});
	$fragmentLastInnerText.css({"width": fragmentLastOriginalWidth()});

	/* Ensure that only one event gets called at a time. */
	var scrollTimerId,
		wheelTimerId,
		orientationchangeTimerId,
		resizeTimerId;
	$(window).scroll(function() {
		clearTimeout(wheelTimerId);
		clearTimeout(orientationchangeTimerId);
		clearTimeout(resizeTimerId);
		scrollTimerId = setTimeout(updateTitle, 1);
	});
	window.addEventListener('wheel', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(orientationchangeTimerId);
		clearTimeout(resizeTimerId);
		wheelTimerId= setTimeout(updateTitle, 1);
	});
	window.addEventListener('orientationchange', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(wheelTimerId);
		clearTimeout(resizeTimerId);
		orientationchangeTimerId = setTimeout(updateTitle, 1);
	});
	window.addEventListener('resize', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(wheelTimerId);
		clearTimeout(orientationchangeTimerId);
		resizeTimerId = setTimeout(updateTitle, 1);
	});

	function updateTitle() {
		if ($(window).width() > 1024) {
			var spacerDistanceToTop = $titleSpacer.offset().top - $(window).scrollTop(),
				distanceToTop;
			if ($title.hasClass("fixed")) {
				distanceToTop = 0;
			} else {
				distanceToTop = $title.offset().top - $(window).scrollTop();
			}

			var percentageLeft = Math.max(distanceToTop, 0)/$title.offset().top;

			if (percentageLeft >= 1) {
				/* Top of the page, animation hasn't started, title is centered */
				$fragmentNBSP.css({"width": nbspWidth()});
				$title.css({
					"width": titleOriginalWidth(),
					"font-size": titleOriginalFontSize() + 'rem',
					"line-height": titleOriginalHeight(),
					"height": titleOriginalHeight()
				});
				$fragmentFirst.css({"width": fragmentFirstOriginalWidth()});
				$fragmentLast.css({"width": fragmentLastOriginalWidth()});
				$fragmentFirstInnerText.css({"width": fragmentFirstOriginalWidth()});
				$fragmentLastInnerText.css({"width": fragmentLastOriginalWidth()});

				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");
			} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
				/* Animation complete, title fixed left */
				$fragmentFirst.css({"width": 0});
				$fragmentLast.css({"width": 0});
				$fragmentNBSP.css({"width": 0});
				$title.css({
					"width": titleFinalWidth(),
					"font-size": titleFinalFontSize() + 'rem',
					"line-height": titleFinalHeight(),
					"height": titleFinalHeight()
				});


				$title.addClass("fixed");
				$titleSpacer.addClass("live");
			} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
				/* Animation in progress */
				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");

				var fragmentFirstNewWidth = fragmentFirstOriginalWidth() * percentageLeft,
					fragmentLastNewWidth = fragmentLastOriginalWidth() * percentageLeft,
					titleNewFontSize = titleFinalFontSize() + (titleOriginalFontSize() - titleFinalFontSize()) * percentageLeft + 'rem',
					titleNewHeight = titleFinalHeight() + (titleOriginalHeight() - titleFinalHeight()) * percentageLeft + 'rem',
					titleNewWidth = (titleOriginalWidth() - titleFinalWidth())*percentageLeft + titleFinalWidth(),
					nbspNewWidth = nbspWidth() * percentageLeft;
				$fragmentNBSP.stop().animate({"width": nbspNewWidth}, 5);
				$fragmentFirst.stop().animate({"width": fragmentFirstNewWidth}, 5);
				$fragmentLast.stop().animate({"width": fragmentLastNewWidth}, 5);
				console.log(titleNewFontSize);
				$title.stop().animate({
					"width": titleNewWidth,
					"font-size": titleNewFontSize,
					"line-height": titleNewHeight,
					"height": titleNewHeight
				}, 5);
			}
		}
		else {
			doMobile();
		}
	}

	function doMobile() {
		$title.removeClass("fixed");
		$fragmentNBSP.css({"width": nbspWidth()});
		$title.css({"width": titleOriginalWidth()});
		$fragmentFirst.css({"width": fragmentFirstOriginalWidth()});
		$fragmentLast.css({"width": fragmentLastOriginalWidth()});
		$fragmentFirstInnerText.css({"width": fragmentFirstOriginalWidth()});
		$fragmentLastInnerText.css({"width": fragmentLastOriginalWidth()});
	}

	function calculateWordWidth(text, classes) {
		classes = classes || [];
		classes.push('textDimensionCalculation');
		var div = document.createElement('div');
		div.setAttribute('class', classes.join(' '));
		div.innerHTML = text;
		document.body.appendChild(div);
		var width = jQuery(div).outerWidth(true);
		div.parentNode.removeChild(div);
		return width;
	}
});