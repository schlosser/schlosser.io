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
			return	calculateWordWidth("D", ["site-title"]) +
				calculateWordWidth("R", ["site-title"]) +
				calculateWordWidth("S", ["site-title"]);
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
		};

	$fragmentFirstInnerText.css({"width": fragmentFirstOriginalWidth()});
	$fragmentLastInnerText.css({"width": fragmentLastOriginalWidth()});
	$(window).scroll(updateTitle);
	window.addEventListener('orientationchange', resizedw);
	window.addEventListener('resize', resizedw);

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
				$fragmentNBSP.css({"width": nbspWidth()});
				$title.css({"width": titleOriginalWidth()});
				$fragmentFirst.css({"width": fragmentFirstOriginalWidth()});
				$fragmentLast.css({"width": fragmentLastOriginalWidth()});
				$fragmentFirstInnerText.css({"width": fragmentFirstOriginalWidth()});
				$fragmentLastInnerText.css({"width": fragmentLastOriginalWidth()});

				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");
			} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
				$fragmentFirst.css({"width": 0});
				$fragmentLast.css({"width": 0});
				$fragmentNBSP.css({"width": 0});
				$title.css({"width": titleFinalWidth()});

				$title.addClass("fixed");
				$titleSpacer.addClass("live");
			} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");

				var fragmentFirstNewWidth = fragmentFirstOriginalWidth() * percentageLeft,
					fragmentLastNewWidth = fragmentLastOriginalWidth() * percentageLeft,
					titleNewWidth = (titleOriginalWidth() - titleFinalWidth())*percentageLeft + titleFinalWidth(),
					nbspNewWidth = nbspWidth() * percentageLeft;
				$fragmentNBSP.animate({"width": nbspNewWidth}, 5);
				$fragmentFirst.animate({"width": fragmentFirstNewWidth}, 5);
				$fragmentLast.animate({"width": fragmentLastNewWidth}, 5);
				$title.animate({"width": titleNewWidth}, 5);
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

	function resizedw() {
		if ($(window).width() > 1024) {
			updateTitle();
		} else {

			doMobile();
		}
	}
});