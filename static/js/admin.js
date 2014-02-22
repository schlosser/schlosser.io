$(function() {
	$(".delete").click(function() {
		$(this).siblings("form").slideDown(200);
	});
	$(".cancel").click(function() {
		$(this).parent().slideUp(200);
	})
});