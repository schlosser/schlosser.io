$(function() {

	var print = false;

	var data = $.parseJSON(jsonString);
	var usedSentences = data["sentences"],
		sentences = [],
		highestTimeoutId = 0;
	resetSentences();
	var currentSentence = sentences[0];
	console.log(currentSentence);
	setLiveSentence(currentSentence);
	sentenceLoop();

	function resetSentences() {
		if (print) {
			console.log("reset");
		}
		sentences = sentences.concat(usedSentences.concat());
		usedSentences = [];
		sentences.sort(function(){ return 0.5 - Math.random(); });
	}

	function sentenceLoop() {
		if (print) {
			console.log("looping");
		}
		if (sentences.length < 1) {
			resetSentences();
		}
		var newSentence;
		for (var i = 0; i < sentences.length; i++) {
			newSentence = sentences[i];
			usedSentences = usedSentences.concat(sentences.splice(i, 1));
			break;
		}
		if (print) {
			console.log("i = ", i , " sentences.length = ", sentences.length);
		}
		setLiveSentence(newSentence);
		currentSentence = newSentence;
		clearTimeout(highestTimeoutId);
		highestTimeoutId = setTimeout(sentenceLoop, 4000);
	}

	function setLiveSentence(newSentence) {
		if (print) {
			console.log("sentences = ", sentences);
			console.log("usedSentences = ", usedSentences);
			console.log("newSentence = ", newSentence);
		}
		for (var key in newSentence) {
			setKey(key, newSentence);
		}
	}

	function setKey(key, newSentence) {
		var $container = $(".sentence ." + key),
			$visible = $(".sentence ." + key + " .visible"),
			$invisible = $(".sentence ." + key + " .invisible"),
			newText = newSentence[key];

		if (newText != $visible.html()) {
			if (print) {
				// console.log("filling in ", key, " with ", newText);
				// console.log("$invisible = ", $invisible);
				// console.log("$visible = ", $visible);
			}
			$invisible.css("width", $invisible.width());
			$visible.stop().animate(
				{"opacity": 0},
				200,
				"linear",
				function() {
					$visible.html("");
					$invisible.html("");
					newWidth = calculateWordWidth(newText, ["sentence"]);
					$invisible.stop().animate(
						{"width": newWidth},
						200,
						"linear",
						function() {
							if (print) {
								console.log("setting text..");
							}
							$invisible.html(newText);
							$visible.html(newText);
							$visible.stop().animate({"opacity":1}, 200, function() {
								$invisible.css("width", "auto");
							});
						}
					);
				}
			);
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

	function resizedw(){
		if (sentences.length < 1) {
			resetSentences();
		}
		setLiveSentence(sentences[0]);
		sentenceLoop();
	}

	var doit;
	function windowDidResize(){
		clearTimeout(doit);
		doit = setTimeout(resizedw, 200);
	}

	window.addEventListener('orientationchange', windowDidResize);
	window.addEventListener('resize', windowDidResize);
});
