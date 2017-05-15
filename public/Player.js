function Player (name, location, l2, score, player, id) {
  this.name = name;
  this.dead = false;
  this.id = id;
  Entity.call(this, location, l2, player, score);

  this.canEat = function() {
    var tmp = [];
    //Only checks the entities that are "awake" which means entities that are within a reasonable range to be eaten or need to be ready for possible collision
    for (var i = 0; i < awakeE.length; i++) {
      var e = awakeE[i];
      if (this.contains(e)) {
        if (p5.Vector.dist(e.loc, this.loc2) <= this.r && e.score < this.score) {
          awakeE.splice(i, 1)
            tmp.push(e);
          continue;
        } else {
          continue;
        }
      }
    }
    return tmp;
  }

  this.contains = function(e) {
    for (var i = 0; i < awakeE.length; i++) {
      if (awakeE[i] === e) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  function getName() {
    return name;
  }

  function getLocation() {
    return loc;
  }
    
    this.setLocation = function(l){
        loc2 = l;
    }

  this.displayScore = function() {
    fill(50);
    textSize(20);
    text("Score: " + this.score, 10, height-10);
  }

  this.displayName = function() {
    fill(0);
    textSize(15);
    text(getName(), (this.loc.x) - (getName().length*1.5), (this.loc.y));
  }

  //function canKill() {
  //  var tmp = [];
  //  for (var p in players) {
  //    if (p != this) {
  //      if (dist(p.loc2.x, p.loc2.y, this.loc2.x, this.loc2.y) <= r) {
  //        tmp.add(p);
  //        continue;
  //      } else {
  //        continue;
  //      }
  //    } else {
  //      continue;
  //    }
  //  }
  //  return tmp;
  //}

  this.kill = function() {
    dead = true;
  }
  

  this.run = function() {
    //print("PlayerX: " + this.loc2.x + " PlayerY: " + this.loc2.y);
    this.render();
    this.displayScore();
    this.displayName();
    var es = this.canEat();
    for (var i = 0; i < es.length; i++) {
      var e = es[i];
      this.score+=e.score;
      this.r = this.getRadius();
      removeEntity(e);
    }
    //for (var p in canKill()) {
    //  this.score+=p.score;
    //  this.r = this.getRadius();
    //}
  }
  
}