$(document).ready(function () {

    var curr_client = "";
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
        var parts = text.split("|");
        var cmd   = (parts.length > 0) ? parts[0].trim() : undefined;
        var command = {};
        command.token = (new Date()).getMilliseconds();
        command.exe = text;

        switch (cmd) {
            case "lister":
                command.exe = cmd;
                command.global = true;
                break;
            case "retirer":
                command.exe = cmd;
                command.global = true;
                command.params = (parts.length > 1) ? parts[1].trim() : undefined;
                break;
            case "contenu":
                command.exe    = cmd;
                command.global = false;
                command.client = (parts.length > 1) ? parts[1].trim() : undefined;
                break;
            default:
                command.global = false;
                command.client = (parts.length > 1) ? parts[1].trim() : undefined;
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
            if (data.message) {
                $('.contenu .output').html(data.message);
            } else {
                $('.contenu .output').html(data.resultat);
            }
        });

        socket.on('disconnect', function () {
            $('.serveur').find('span').text("Déconnecté");
        });
    }
});