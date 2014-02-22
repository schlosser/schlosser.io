$(window).bind("load", function() {
	var $title = $(".site-title"),
		$titleSpacer = $(".title-spacer"),
		$lowerFirst = $(".lowercase-first"),
		$lowerLast = $(".lowercase-last"),
		$lowerFirstInnerText = $(".lowercase-first span"),
		$lowerLastInnerText = $(".lowercase-last span"),
		$lowerNBSP = $(".lowercase-nbsp"),
		nbspWidth = function() {
			return calculateWordWidth("&nbsp;", ["site-title"]);
		},
		titleFinalWidth = function () {
			return	calculateWordWidth("D", ["site-title"]) +
				calculateWordWidth("R", ["site-title"]) +
				calculateWordWidth("S", ["site-title"]);
		},
		lowerFirstOriginalWidth = function() {
			if ($(window).width() < 1024) {
				return "auto";
			}
			return calculateWordWidth($lowerFirstInnerText.text(), ["site-title"]);
		},
		lowerLastOriginalWidth = function() {
			if ($(window).width() < 1024) {
				return "auto";
			}
			return calculateWordWidth($lowerLastInnerText.text(), ["site-title"]);
		},
		titleOriginalWidth = function() {
			return $("body").width();
		};

	$lowerFirstInnerText.css({"width": lowerFirstOriginalWidth()});
	$lowerLastInnerText.css({"width": lowerLastOriginalWidth()});
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
				$lowerNBSP.css({"width": nbspWidth()});
				$title.css({"width": titleOriginalWidth()});
				$lowerFirst.css({"width": lowerFirstOriginalWidth()});
				$lowerLast.css({"width": lowerLastOriginalWidth()});
				$lowerFirstInnerText.css({"width": lowerFirstOriginalWidth()});
				$lowerLastInnerText.css({"width": lowerLastOriginalWidth()});

				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");
			} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
				$lowerFirst.css({"width": 0});
				$lowerLast.css({"width": 0});
				$lowerNBSP.css({"width": 0});
				$title.css({"width": titleFinalWidth()});

				$title.addClass("fixed");
				$titleSpacer.addClass("live");
			} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
				$title.removeClass("fixed");
				$titleSpacer.removeClass("live");

				var lowerFirstNewWidth = lowerFirstOriginalWidth() * percentageLeft,
					lowerLastNewWidth = lowerLastOriginalWidth() * percentageLeft,
					titleNewWidth = (titleOriginalWidth() - titleFinalWidth())*percentageLeft + titleFinalWidth(),
					nbspNewWidth = nbspWidth() * percentageLeft;
				$lowerNBSP.animate({"width": nbspNewWidth}, 5);
				$lowerFirst.animate({"width": lowerFirstNewWidth}, 5);
				$lowerLast.animate({"width": lowerLastNewWidth}, 5);
				$title.animate({"width": titleNewWidth}, 5);
			}
		}
		else {
			doMobile();
		}
	}

	function doMobile() {
		$title.removeClass("fixed");
		$lowerNBSP.css({"width": nbspWidth()});
		$title.css({"width": titleOriginalWidth()});
		$lowerFirst.css({"width": lowerFirstOriginalWidth()});
		$lowerLast.css({"width": lowerLastOriginalWidth()});
		$lowerFirstInnerText.css({"width": lowerFirstOriginalWidth()});
		$lowerLastInnerText.css({"width": lowerLastOriginalWidth()});
	}

	function calculateWordWidth(text, classes) {
		classes = classes || [];
		classes.push('textDimensionCalculation');
		var div = document.createElement('div');
		div.setAttribute('class', classes.join(' '));
		div.innerHTML = text;
		document.body.appendChild(div);
		var width = jQuery(div).outerWidth(true);
		// div.parentNode.removeChild(div);
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