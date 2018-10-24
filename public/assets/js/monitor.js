$(document).ready(function(){

    $('#adresse').val(location.href);

	var URL    = $('#adresse').val();
	var socket = null;

	if (URL) {
		socket = io(URL);
		link();
	}

	$('#adresse').keypress(function(e){
        var key = e.keyCode;
	    if (key === 13) {
	    	var u  = $(this).val();
	    	socket = io(u);
	    	link();
	    }
	});

    $('.champ').keypress(function(e){
    	var key = e.keyCode;
	    if (key === 13) {
	    	var command = $(this).val();
	    	if (!command) return;
            $(this).val("");
            var contenu = $(".contenu");
            contenu.html(contenu.html() + "<br> # " + command);
            $('body').scrollTop(99*99*99);
	    }
    });

    function link(){
		socket.on('auth', function(){
		    $('.serveur').find('span').text("Connecté");
		    $('.champ').focus();
		});

		socket.on('disconnect', function(){
			$('.serveur').find('span').text("Déconnecté");
		});
    }
})