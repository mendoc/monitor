$(document).ready(function () {

    var adresse = $('#adresse');
    adresse.val(location.href);

    var URL = adresse.val();
    var socket = null;

    if (URL) {
        socket = io(URL);
        link();
    }

    adresse.keypress(function (e) {
        var key = e.keyCode;
        if (key === 13) {
            var u = $(this).val();
            socket = io(u);
            link();
        }
    });

    $('.champ').keypress(function (e) {
        var key = e.keyCode;
        if (key === 13) {
            var text = $(this).val();
            if (!text) return;
            $(this).val("");
            var contenu = $(".contenu");
            exec(text);
            $('body').scrollTop(99 * 99 * 99);
        }
    });

    function exec(text) {
        var parts = text.split(" ");
        var cmd   = (parts.length > 0) ? parts[0] : undefined;
        var command = {};
        command.token = (new Date()).getMilliseconds();
        command.exe = text;
        command.global = true;

        switch (cmd) {
            case "retirer":
                command.exe = cmd;
                command.params = (parts.length > 1) ? parts[1] : undefined;
                break;
            default:
                break;
        }

        if (socket) {
            socket.emit("command", command);
            $('.contenu .command').text(text);
        }
    }

    function link() {
        socket.on('auth', function () {
            $('.serveur').find('span').text("Connecté");
            $('.champ').focus();
        });

        socket.on('reponse', function (data) {
            if (data.erreur) {
                $('.contenu .output').text(data.message);
            } else {
                $('.contenu .output').html(data.resultat);
            }
        });

        socket.on('disconnect', function () {
            $('.serveur').find('span').text("Déconnecté");
        });
    }
});