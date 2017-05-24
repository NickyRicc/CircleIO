// Constants for the amount of cells and their sizes
var sqrR;
var cellR;
var zoom = 1;
// Viewing distance constant
var vDist;

var rMode = true;
// Constant for radius on start
var R = .5;
// Creates a constant for the amount of entities to be created on world creation
// based on world size and percentage of coverage in world (default currently
// 30%)
var eA = (sqrR * sqrR) * .01;
// Where all entities in the world are stored
var entities = [];
// Will be used for keeping track of players in a world
var player;
// Where "awake" (entities within viewing range) entities are stored so that
// there are less entities to check and so there isn't a waste in time spent
// checking entities with no chance of collision
var awakeE = [];
// Location for each tile in the world
var tiles = [];
// Location for each tile within viewing distance
var Atiles = [];

var players = [];

var socket = io.connect('http://' + prompt("Server IP:"));

var id;

var connected = false;

function setup() {
    var name = prompt("Enter Name:");
	if (name == null || name == "") {
		name = "Anon";
	}
	createCanvas((window.innerWidth), (window.innerHeight));
	background(255);
	frameRate(60);
	vDist = width / 8;
	// createVector(random(-sqrR/2, sqrR/2), random(-sqrR/2, sqrR/2))
	this.player = new Player(name, createVector(width/2, height/2), createVector(random(-sqrR, sqrR), random(-sqrR, sqrR)), 10, true, socket.id);
    socket.emit('getID');
	var i = 0;
	document.title = "CircleIO";
}

var startTime;

setInterval(function() {
  startTime = Date.now();
  socket.emit('ping');
}, 500);

socket.on('killed', function(pl){
	print(pl);
	if(pl.x == this.player.loc2.x && pl.y == this.player.loc2.y){
		this.player = null;
		this.name = prompt("Enter Name:");
	if (name == null || name == "") {
		name = "Anon";
	}
	this.player = new Player(name, createVector(width/2, height/2), createVector(random(-sqrR, sqrR), random(-sqrR, sqrR)), 10, true, socket.id);
		return;	
	}else{
		i = players.indexOf(pl);
		players.splice(i, 1);
		return;	
	}
});

socket.on('id', function(id){
    print("Connected with id:" + id);
    player.id = id;
    socket.emit('update', new PL(player.loc2.x, player.loc2.y, player.score, player.name, socket.id));
    connected = true;
});

socket.on('pong', function() {
  latency = Date.now() - startTime;
  console.log(latency);
});

socket.on('disconnected', function(id){
    for(p in players){
        if(players[p].id === id){
            players.splice(p, 1);
            return;
        }
    }
});

socket.on('players', function(pl){
   if(pl.id != socket.id){
       for(p in players){
           if(players[p].id === pl.id){
               players[p].loc = createVector(pl.x, pl.y);
               players[p].score = pl.score;
               return;
           }else if(players[p].id === socket.id){
               players.splice(p, 1);
               continue;
           }else{
               continue;
           }
       }
       var cp = new Player(pl.name, createVector(pl.x, pl.y), createVector(pl.x, pl.y), pl.score, false, pl.id);
       players.push(cp);
       return;
   } 
});

socket.on('gen', 
          function(v, sq, cr){
    print("Loading Map...");
	sqrR = sq;
	cellR = cr;
    if(tiles.length <= 0){
    for(vec in v){
        tiles[vec] = createVector(v[vec].x, v[vec].y);
    }
    updateATiles();
    }
});

socket.on('ne', function(e){
	var en = new Entity(createVector(e.x, e.y), null, e.player, e.score);
	entities.push(en);
});

socket.on('pop', function(E){
    print("Loading Entities...");
    for(e in E){
        var en = new Entity(createVector(E[e].x, E[e].y), null, E[e].player, E[e].score);
        if(!containse(en)){
         entities.push(en); 
        }
    }
    for(e in remove){
        var indx = entities.indexOf(remove[e]);
        entities.splice(indx, 1);
    }
    updateAwake();
});


var test = 100;
function drawGrid() {
	for (var i = 0; i < Atiles.length; i++) {
		colorMode(RGB);
		fill(255);
		stroke(130);
		strokeWeight(.5);
		rect(Atiles[i].x, Atiles[i].y, cellR, cellR);
	}
}

var inter = 0;
function draw() {
	background(255);
	var newzoom = 10;
	// Is used to slowly create a scale for the world and player so that things
	// are adjusted for the players cell size
	// Also adjusts the world to the scale so things appear where they should be
	// otherwise a cell appears to be right infront of you but its actual
	// location is a few hundred pixels the otherway
	zoom = lerp(zoom, newzoom, .1);
	push();
	translate(width / 2, height / 2);
	scale(zoom);
	translate(-((player.loc2.x)), -((player.loc2.y)));
	drawGrid();
	for (var i = 0; i < awakeE.length; i++) {
		awakeE[i].render();
	}
    for(p in players){
        var pl = players[p];
        pl.getRadius();
        pl.render();
        displayName(players[p].name, pl);
    }
	pop();
	player.run();
	player.move();
    if(connected){
    socket.emit('update', new PL(player.loc2.x, player.loc2.y, player.score, player.name, socket.id));
    }
    if(inter <= 0){
    updateAwake();
    updateATiles();
        inter = 100;
    }
	inter--;
	displayEntities();
}

function populate() {
	while (entities.length < eA) {
		var e = new Entity(createVector(random(-sqrR, sqrR),
				random(-sqrR, sqrR)), null, false, 1);
		entities.push(e);
	}
}
// Updates the visable tiles in the world
function updateATiles() {
	for (at in Atiles) {
		if (dist(Atiles[at].x, Atiles[at].y, this.player.loc2.x,
				this.player.loc2.y) < vDist) {
			continue;
		} else {
			Atiles.splice(at, 1);
			continue;
		}
	}

	for (t in tiles) {
		if (dist(tiles[t].x, tiles[t].y, this.player.loc2.x, this.player.loc2.y) < vDist) {
			if (containsT(tiles[t])) {
				continue;
			} else {
				Atiles.push(tiles[t]);
				continue;
			}
		} else {
			continue;
		}
	}
}

function containsT(t) {
	for (e in Atiles) {
		if (Atiles[e] === t) {
			return true;
		} else {
			continue;
		}
	}
	return false;
}

function containsE(e) {
	for (i in awakeE) {
		if (awakeE[i] === e) {
			return true;
		} else {
			continue;
		}
	}
	return false;
}

function displayEntities() {
	displayDimensions();
	fill(0);
	textSize(15);
	text("Total Entities: " + entities.length, 20, 20);
}

function displayDimensions() {
	fill(0);
	textSize(1);
	text("Dimensions: " + sqrR + "x" + sqrR, width - 200, 20);
	fill(0);
	textSize(15);
	text("Location: X=" + Math.round(player.loc2.x) + " Y="
			+ Math.round(player.loc2.y), width - 200, 40);
}

function updateAwake() {
	for (ae in awakeE) {
		if (dist(awakeE[ae].loc.x, awakeE[ae].loc.y, this.player.loc2.x,
				this.player.loc2.y) < vDist) {
			continue;
		} else {
			awakeE.splice(ae, 1);
			continue;
		}
	}
	for (e in entities) {
		if (dist(entities[e].loc.x, entities[e].loc.y, this.player.loc2.x,
				this.player.loc2.y) < vDist) {
			if (containsE(entities[e])) {
				continue;
			} else {
				awakeE.push(entities[e]);
				continue;
			}
		} else {
			continue;
		}
	}

}

function awake(e) {
	if (dist(e.loc.x, e.loc.y, player.loc2.x, player.loc2.y) <= vDist) {
		return true;
	} else {
		return false;
	}
}

function removeEntity(e) {
	for (var i = 0; i <= entities.length - 1; i++) {
		if (entities[i] === e) {
			entities.splice(i, 1)
            var en = new E(e.loc.x, e.loc.y, e.player, e.score);
            socket.emit('ate', en);
			return;
		}
	}
}

function E(x, y, player, score){
    this.x = x;
    this.y = y;
    this.player = player;
    this.score = score;
}

function Vector(x, y){
    this.x = x;
    this.y = y;
}

function displayName(name, cp) {
    fill(0);
    textSize(15);
    text(name, (cp.loc.x), (cp.loc.y));
  }

function containse(e){
    for(en in entities){
        if(entities[en] === e){
            return true;
        }
    }
    return false;
}

function convertPlayer(player){
	return new PL(player.loc2.x, player.loc2.y, player.score, player.id);	
}

function PL(x, y, score, name, id){
    this.x = x;
    this.y = y;
    this.score = score;
    this.name = name;
    this.id = id;
}
