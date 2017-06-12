var express = require('express');
var app = express();
var intIp = require('internal-ip')
var server = app.listen(80, function(){
    listen();
});
var entities = [];
var tiles = [];
var sqrR = 1000;
var cellR = 20;
var eA = (sqrR * sqrR) * .01;
var removeE = [];
// app.listen(3000);

app.use(express.static('public'));

function listen() {
	console.log('App listening at http://' + intIp.v4());
	initPop();
	genMap();
}

var io = require('socket.io')(server, {'pingInterval': 2000, 'pingTimeout': 10000});
//var io = io.listen(server);

io.sockets.on('connection', function(socket) {
	console.log("New user connected with id: " + socket.id);
	socket.emit('gen', tiles, sqrR, cellR);
    socket.emit('pop', entities);
    
    socket.on('disconnect', function () {
        console.log('Disconnected with id:' + socket.id);
        io.sockets.emit('disconnected', socket.id);
    });
    
    socket.on('getID', function() {socket.emit('id', socket.id)});
    
    socket.on('ate', function(e){
        removeEntity(e);
		socket.emit('eaten', e);
    });
	
	socket.on('kill', function(pl){
		console.log("Player: " + pl.name + " has been killed!");
		io.sockets.emit('killed', pl);
	});
    
    socket.on('update', function(player){
        io.sockets.emit('players', player);
    });
    
    socket.on('ping', function(){
        socket.emit('pong');
    });
    
});






io.sockets.on('update', function(player) {
	io.sockets.emit('data', player);
});



function initPop() {
	while (entities.length < eA) {
		var e = new E(random(-sqrR, sqrR),
				random(-sqrR, sqrR), false, 1);
		entities.push(e);
	}
}

function populate(){
    var es = [];
    for(i = entities.length; i <= eA; i++){
        var e = new E(random(-sqrR, sqrR),
				random(-sqrR, sqrR), false, 1);
		es.push(e);
    }
    return es;
}

function newEntity(){
	return e = new E(random(-sqrR, sqrR),
				random(-sqrR, sqrR), false, 1);
}

function genMap() {
    var i = 0;
	for (var x = -sqrR; x <= sqrR; x += cellR) {
		for (var y = -sqrR; y <= sqrR; y += cellR) {
			tiles[i] = new Vector(x, y);
			i++;
		}
	}
}

function random(min, max) {
seeded = false;
  var rand;

  if (seeded) {
    rand  = lcg.rand();
  } else {
    rand = Math.random();
  }
  if (typeof min === 'undefined') {
    return rand;
  } else
  if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max-min) + min;
  }
};

function randomNum(min, max) {
    return Math.floor(Math.random() * (max)) + min;
}

function E(x, y, player, score){
    this.x = x;
    this.y = y;
    this.player = player;
    this.score = score;
}
    
function Player(x, y, score, name, id){
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
    this.name = name;
}

function Vector(x, y){
    this.x = x;
    this.y = y;
}

function removeEntity(e){
    for(i in entities){
        if(entities[i].x === e.x && entities[i].y === e.y){
            entities.splice(i, 1);
			var e = newEntity();
        	io.sockets.emit('ne', e);
            continue;
        }else{
            continue;
        }
    }
}
