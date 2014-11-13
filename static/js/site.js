$(function() {

	var print = false;

	var usedSentences,
		currentSentence,
		sentences = [],
		highestTimeoutId = 0;
	$.getJSON("/sentences", function(json){
		usedSentences = json["sentences"];
		resetSentences();
		currentSentence = sentences[0];
		setLiveSentence(currentSentence);
		sentenceLoop();
	});

	function resetSentences() {
		sentences = sentences.concat(usedSentences.concat());
		usedSentences = [];
		sentences.sort(function(){ return 0.5 - Math.random(); });
	}

	function sentenceLoop() {
		if (sentences.length < 1) { resetSentences();}
		var newSentence = sentences[0];
		usedSentences = usedSentences.concat(sentences.splice(0, 1));
		setLiveSentence(newSentence);
		currentSentence = newSentence;
		clearTimeout(highestTimeoutId);
		highestTimeoutId = setTimeout(sentenceLoop, 4000);
	}

	function setLiveSentence(newSentence) {
		for (var key in newSentence) {
			if (key !== '_id') {
				setKey(key, newSentence);
			}
		}
	}

	function setKey(key, newSentence) {
		var $container = $(".sentence ." + key),
			$visible = $(".sentence ." + key + " .visible"),
			$invisible = $(".sentence ." + key + " .invisible"),
			newText = newSentence[key];

		if (newText !== $visible.html()) {
			$invisible.css('width', window.getComputedStyle($invisible[0],null).width);
			$visible.stop().animate({"opacity": 0}, 200)
				.promise().done(function() {
					$visible.html("");
					$invisible.html("");
					newWidth = calculateWordWidth(newText, ["sentence"]);
					$invisible.stop().animate({"width": newWidth}, 200)
						.promise().done(function() {
							if (print) {
								console.log("setting text..");
							}
							$invisible.html(newText);
							$visible.html(newText);
							$visible.stop().animate({"opacity":1}, 200)
								.promise().done(function() {
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
		var width = window.getComputedStyle(div,null).width
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
