// Importation des modules
var express    = require('express');
var http       = require('http');

var port = 18433; /*Port en fonction de la date du jour 18 => 2018, 37 => 37 ème semaine, 4 => 4 ème jour (jeudi)*/

var app = express();

// Création du serveur
var serveur = http.Server(app);
var io = require('socket.io')(serveur);

app.use(express.static("public"));
app.set('view engine', 'ejs');

// Les routes
app.get('/', function (req, res) {
    res.render('home');
});

//Gestion des évènements
io.sockets.on('connection', function (socket) {

    console.log("Morning...");
    socket.emit('auth');

    socket.on('disconnect', function(){
        console.log("Bye bye !")
    });
});

// Lancement du serveur
serveur.listen(port);

console.log('\n Go to http://localhost:' + port + "\n");