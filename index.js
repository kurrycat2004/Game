var express = require('express');
var app = express();


let players = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/home/runner/public/index.html');
});

var server = require('http').Server(app);

server.listen(function() {
  console.log(`Listening on ${server.address().port}`);
});
const io = require('socket.io').listen(server);

io.sockets.on('connection',
  function(socket) {
    console.log("We have a new client: " + socket.id);
    io.to(socket.id).emit('init', { id: socket.id });
    socket.on('disconnect', function() {
      console.log("Client has disconnected: " + socket.id);
      socket.broadcast.emit("disconnection", { id: socket.id })
    });
    socket.on("update", function(data){
      socket.broadcast.emit("update", data);
    })
  }
);