$(window).bind("load", function() {
	var $title = $(".site-title"),
		$titleSpacer = $(".title-spacer"),
		$lowerFirst = $(".lowercase-first"),
		$lowerLast = $(".lowercase-last"),
		$lowerFirstInnerText = $(".lowercase-first span"),
		$lowerLastInnerText = $(".lowercase-last span"),
		$lowerNBSP = $(".lowercase-nbsp"),
		nbspWidth = calculateWordWidth(" ", ["site-title"]),
		titleFinalWidth = calculateWordWidth("DRS", ["site-title"]),
		lowerFirstOriginalWidth = calculateWordWidth($lowerFirstInnerText.text(), ["site-title"]),
		lowerLastOriginalWidth = calculateWordWidth($lowerLastInnerText.text(), ["site-title"]);
	var titleOriginalWidth = function() {
		return $(window).width();
	};

	// Set the original width of the lowercase letters
	$lowerFirstInnerText.css({"width": lowerFirstOriginalWidth});
	$lowerLastInnerText.css({"width": lowerLastOriginalWidth});

	$(window).scroll(updateTitle);

	function updateTitle() {
		var spacerDistanceToTop = $titleSpacer.offset().top - $(window).scrollTop(),
			distanceToTop;
		if ($title.hasClass("fixed")) {
			distanceToTop = 0;
		} else {
			distanceToTop = $title.offset().top - $(window).scrollTop();
		}

		var percentageLeft = Math.max(distanceToTop, 0)/$title.offset().top;

		if (percentageLeft >= 1) {
			console.log(1);
			$title.removeClass("fixed");
			$titleSpacer.removeClass("live");

			$lowerNBSP.animate({"width": nbspWidth}, 10);
			$title.css({"width": titleOriginalWidth()});
			$lowerFirst.css({"width": lowerFirstOriginalWidth});
			$lowerLast.css({"width": lowerLastOriginalWidth});
		} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
			console.log(2);
			$lowerFirst.css({"width": 0});
			$lowerLast.css({"width": 0});

			$lowerNBSP.animate({"width": 0}, 10);
			$title.addClass("fixed");
			$titleSpacer.addClass("live");
			$title.animate({"width": titleFinalWidth}, 10);
		} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
			console.log(3);
			$title.removeClass("fixed");
			$titleSpacer.removeClass("live");

			$lowerNBSP.animate({"width": nbspWidth}, 10);
			var lowerFirstNewWidth = lowerFirstOriginalWidth * percentageLeft,
				lowerLastNewWidth = lowerLastOriginalWidth * percentageLeft,
				titleNewWidth = (titleOriginalWidth() - titleFinalWidth)*percentageLeft + titleFinalWidth;
			$lowerFirst.animate({"width": lowerFirstNewWidth}, 5);
			$lowerLast.animate({"width": lowerLastNewWidth}, 5);
			$title.animate({"width": titleNewWidth}, 5);
		}
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
		console.log("sup");
		var spacerDistanceToTop = $titleSpacer.offset().top - $(window).scrollTop(),
			distanceToTop;
		if ($title.hasClass("fixed")) {
			distanceToTop = 0;
		} else {
			distanceToTop = $title.offset().top - $(window).scrollTop();
		}
		var percentageLeft = Math.max(distanceToTop, 0)/$title.offset().top;
		if (percentageLeft >= 1) {
			$title.css({"width": titleOriginalWidth()});
		} else if (spacerDistanceToTop <= 0 && distanceToTop <= 0) {
			$title.animate({"width": titleFinalWidth}, 10);
		} else if (percentageLeft > 0 && distanceToTop > 0 || spacerDistanceToTop >= 0){
			var titleNewWidth = (titleOriginalWidth() - titleFinalWidth)*percentageLeft + titleFinalWidth;
			$title.animate({"width": titleNewWidth}, 5);
		}
	}

	window.addEventListener('orientationchange', resizedw);
	window.addEventListener('resize', resizedw);
});