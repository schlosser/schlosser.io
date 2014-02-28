$(function() {
	if (Modernizr.touch) {
		$(".delete").addClass("touch");
		$(".admin-sentence .sentence-text").click(function() {
			$(this).siblings("form").slideToggle(200);
		});
	}
	$(".delete").click(function() {
		$(this).siblings("form").slideToggle(200);
	});
	$(".cancel").click(function() {
		$(this).parent().slideUp(200);
	});
});