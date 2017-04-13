/* test affichage de l'identifiant unique */
// const uuid = require('uuid/v4');
// console.log(uuid());

const uuid = require('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const port = 8080;

// Instanciation du serveur web, de Express et de Socket.io
const app = express();
const server = http.Server(app);
const io = socketio(server); // io est une instance de socketio

/* Lancement du serveur HTTP */
server.listen(port, () => { //on indique au serveur d'écouter sur le port 8080
    console.log('Listening on port ' + port); // affichage du port
}); // on aurait pu mettre server.listen(port)

/* Contenu du dossier public accessible sur le web */
app.use('/', express.static(__dirname + '/public'));

// Liste des connectés
const users = [];

// Connexion des clients socket.io
io.on('connection', (socket) => {//écoute l'évenement connection(prédéfini par socketio) (socketio nous fourni socket, qui est un objet (une instance de socketio), on pourrai remplacer socket par le terme qu'on veut)
  console.log('User (' + socket.id + ') vient de se connecter');

  // Ajout d'un connecté
  const user = {
    id: socket.id,
    nickname: socket.id
  };
  users.push(user); //ajoute cet user dans le tableau users

  // Diffusion de la liste de connectés à tout le monde
  io.emit('users', users);

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => { //écoute l'evenement disconnect
    console.log('User (' + socket.id + ') vient de se déconnecter');
    users.splice(users.indexOf(user), 1); // Suppression du user de la liste
    io.emit('users', users); // Diffusion de la liste de connectés à tout le monde
  });

  /* Réception et diffusion d'un nouveau message */
  socket.on('msg', (txt) => { // écoute les evenements 'msg' et récupère  leur valeur
    io.emit('msg', txt); //emission du 'msg' à ceux qui daignent l'écouter
  });

});
