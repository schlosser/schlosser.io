$(function() {
	if (Modernizr.touch) {
		$(".delete").addClass("touch");
	}
	$(".delete").click(function() {
		$(this).siblings("form").slideToggle(200);
	});
	$(".cancel").click(function() {
		$(this).parent().slideUp(200);
	});
});