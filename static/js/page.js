$(window).bind("load", function() {
	var MIN = 768,
		$title = $(".site-title"),
		$titleSpacer = $(".title-spacer"),
		$links = $('.social ul'),
		$linksWrapper = $('.social'),
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
			if ($(window).width() < MIN) {
				return "auto";
			}
			return calculateWordWidth($fragmentFirstInnerText.text(), ["site-title"]);
		},
		fragmentLastOriginalWidth = function() {
			if ($(window).width() < MIN) {
				return "auto";
			}
			return calculateWordWidth($fragmentLastInnerText.text(), ["site-title"]);
		},
		titleOriginalWidth = function() {
			return $("body").innerWidth() - 32;
		},
		titleOriginalFontSize = function() {
			var width = $(window).width();
			if (width > 1024) return 4.75;
			if (width > 768) return 4;
			return 3;
		},
		titleFinalFontSize = 1.3,
		titleOriginalHeight = function() {
			var width = $(window).width();
			if (width > 1024) return 6;
			return 4;
		},
		titleFinalHeight = 3.3;

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
		scrollTimerId = setTimeout(updateTitle, 4);
	});
	window.addEventListener('wheel', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(orientationchangeTimerId);
		clearTimeout(resizeTimerId);
		wheelTimerId= setTimeout(updateTitle, 4);
	});
	window.addEventListener('orientationchange', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(wheelTimerId);
		clearTimeout(resizeTimerId);
		orientationchangeTimerId = setTimeout(updateTitle, 4);
	});
	window.addEventListener('resize', function() {
		clearTimeout(scrollTimerId);
		clearTimeout(wheelTimerId);
		clearTimeout(orientationchangeTimerId);
		resizeTimerId = setTimeout(updateTitle, 4);
	});

	function updateTitle() {
		if ($(window).width() > MIN) {
			var spacerDistanceToTop = $titleSpacer.offset().top - $(window).scrollTop(),
				distanceToTop;
			if ($title.hasClass("fixed")) {
				distanceToTop = 0;
			} else {
				distanceToTop = $title.offset().top - $(window).scrollTop();
			}
			console.log(distanceToTop)

			var percentageLeft = Math.max(distanceToTop, 0)/$title.offset().top;

			if (percentageLeft >= 1) {
				/* Top of the page, animation hasn't started, title is centered */
				$fragmentNBSP.css({"width": nbspWidth()});
				$title.css({
					"width": Math.ceil(titleOriginalWidth()),
					"font-size": titleOriginalFontSize() + 'rem',
					"line-height": titleOriginalHeight() + 'rem',
					"height": titleOriginalHeight() + 'rem'
				});
				$fragmentFirst.css({"width": Math.ceil(fragmentFirstOriginalWidth())});
				$fragmentLast.css({"width": Math.ceil(fragmentLastOriginalWidth())});
				$fragmentFirstInnerText.css({"width": Math.ceil(fragmentFirstOriginalWidth())});
				$fragmentLastInnerText.css({"width": Math.ceil(fragmentLastOriginalWidth())});

				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");
			} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
				/* Animation complete, title fixed left */
				$fragmentFirst.css({"width": 0});
				$fragmentLast.css({"width": 0});
				$fragmentNBSP.css({"width": 0});
				$title.css({
					"width": titleFinalWidth(),
					"font-size": titleFinalFontSize + 'rem',
					"line-height": titleFinalHeight + 'rem',
					"height": titleFinalHeight + 'rem'
				});


				$title.addClass("fixed");
				$titleSpacer.addClass("live");
			} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
				/* Animation in progress */
				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");

				var fragmentFirstNewWidth = Math.ceil(fragmentFirstOriginalWidth() * percentageLeft),
					fragmentLastNewWidth = Math.ceil(fragmentLastOriginalWidth() * percentageLeft),
					titleNewFontSize = titleFinalFontSize + (titleOriginalFontSize() - titleFinalFontSize) * percentageLeft + 'rem',
					titleNewHeight = titleFinalHeight + (titleOriginalHeight() - titleFinalHeight) * percentageLeft + 'rem',
					titleNewWidth = Math.ceil((titleOriginalWidth() - titleFinalWidth())*percentageLeft + titleFinalWidth()),
					nbspNewWidth = Math.ceil(nbspWidth() * percentageLeft);
				$fragmentNBSP.stop().animate({"width": nbspNewWidth}, 5);
				$fragmentFirst.stop().animate({"width": fragmentFirstNewWidth}, 5);
				$fragmentLast.stop().animate({"width": fragmentLastNewWidth}, 5);
				$title.stop().animate({
					"width": titleNewWidth,
					"font-size": titleNewFontSize,
					"line-height": titleNewHeight,
					"height": titleNewHeight
				}, 5);
			}
			updateNav();
		}
		else {
			doMobile();
		}
	}

	function updateNav() {
		var spacerDistanceToTop = $linksWrapper.offset().top - $(window).scrollTop(),
			distanceToTop;
		if ($links.hasClass("fixed")) {
			distanceToTop = 0;
		} else {
			distanceToTop = $links.offset().top - $(window).scrollTop();
		}	
		if (spacerDistanceToTop > 0) {	
			$links.removeClass('fixed');
		} else if (spacerDistanceToTop <= 0 && ! $links.hasClass('fixed')) {
			$links.addClass('fixed');
		}
	}

	function doMobile() {
		$title.removeClass("fixed");
		$links.removeClass('fixed');
		$fragmentNBSP.css({"width": nbspWidth()});
		$title.css({
			"width": titleOriginalWidth(),
			"font-size": titleOriginalFontSize() + 'rem',
			"line-height": titleOriginalHeight() + 'rem',
			"height": titleOriginalHeight() + 'rem'
		});
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
		/* Get a string of the form '12.455px' */
		var widthString = window.getComputedStyle(div,null).width;
		/* Parse that to a number of the form 12.455 */
		var width = parseFloat(widthString.substring(0,widthString.length-2));
		div.parentNode.removeChild(div);
		return width;
	}
});