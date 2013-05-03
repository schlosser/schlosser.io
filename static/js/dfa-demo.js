$(document).ready(function(){
    var defaultText = $("textarea").val();
	$(".wait-msg").hide();
	$("#submit").click(function(e){
		$("textarea").attr("disabled", "disabled");
        $("#namebox").attr("disabled", "disabled");
		$("#submit").attr("disabled", "disabled");
		$(".wait-msg").slideDown();
		e.preventDefault();
		$("#edit").click(function(){
			$("textarea").removeAttr("disabled");
            $("#namebox").removeAttr("disabled");
			$("#submit").removeAttr("disabled");
			$(".wait-msg").hide();
		});
	});
    $('#continue').click(function(){
        var text = $("textarea").val();
        var name = $("#namebox").val();
        $(".wait-msg").slideUp('fast');
        window.setTimeout(function(){
            $('.comments').append('<div class="comment"><hr/><h5>' + name + '</h5><p>' + text + '</p></div>').show('slow');
            $("textarea").removeAttr("disabled");
            $("#namebox").removeAttr("disabled");
            $("textarea").val("");
            $("#namebox").val("");
            $("#submit").removeAttr("disabled");
        }, 500);
    });
	// $("textarea").focus(function() {
    // if( $(this).val() == defaultText ) {
        // $(this).val("");
    // }
	// });
	    // $("textarea").blur(function() {
    // if( $(this).val() == "" ) {
        // $(this).val(defaultText);
    // }
	// });
});
