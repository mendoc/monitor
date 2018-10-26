// Importation des modules
var express    = require('express');
var http       = require('http');
var out        = require('./inc/output');

var port = 18433; /*Port en fonction de la date du jour 18 => 2018, 37 => 37 ème semaine, 4 => 4 ème jour (jeudi)*/

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

    var client = {};
    client.name = req.query.name;
    client.time = req.query.time;
    client.ver  = req.query.ver;

    clients[client.name] = client;

    res.end(client.command);
});

//Gestion des évènements
io.sockets.on('connection', function (socket) {

    console.log("Morning...");
    socket.emit('auth');

    socket.on('command', function(data){
        console.log(data);
        if (data.global) {
            let reponse = {};
            reponse.token  = data.token;
            reponse.erreur = false;
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
                            delete clients[data.params];
                        }
                    } else {
                        reponse.erreur  = true;
                        reponse.message = "Paramètre manquant";
                    }

                    reponse.resultat = out.lister(clients);
                    break;
                default:
                    reponse.erreur  = true;
                    reponse.message = "Comande inconnue";
                    break;
            }
            socket.emit("reponse", reponse);
        }
    });


    socket.on('disconnect', function(){
        console.log("Bye bye !")
    });
});

// Lancement du serveur
serveur.listen(port);

console.log('\n Go to http://localhost:' + port + "\n");