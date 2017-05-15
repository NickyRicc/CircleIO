function Entity(location, l2, player, score) 
{
  this.loc = location;
    //createVector(random(-sqrR, sqrR), random(-sqrR, sqrR));
  this.loc2 = l2;
  var food = food;
  this.player = player;
  var virus = virus;
  var r;
  var g;
  var b;
  this.n = 0;
  this.r;
  this.score = score;
  if (player && food) 
  {
    println("Error: players are not food!");
    return;
  } else 
  {
    if (this.rMode) {
      colorMode(HSB);
    } else 
    {
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
    }
  }

  this.getLocation = function() {
    return this.loc;
  }

  this.getLocation2 = function() {
    return this.loc2;
  }

  this.render = function() 
  {
    //var p = players.get(0);
    this.r = this.getRadius();
    if (!this.player) 
    {
    }
    if (this.player) 
    {
      if (rMode) {
		  
        if (this.n >= 255) 
        { 
          this.n=0;
        }else
		{
        this.n+=10;
		}
      }
      push();
      translate(width/2, height/2);
      scale(10);
      translate(-((this.loc.x)), -((this.loc.y)));
      colorMode(HSB, 255);
      fill(this.n, 255, 255);
      noStroke();
      ellipse(this.loc.x, this.loc.y, this.r*2, this.r*2);
      pop();
    } else if (!this.player) 
    {
      if (rMode) {
        if (this.n >= 255) 
        { 
          this.n=0;
        }else
		{
        this.n++;
		}
      }
        colorMode(HSB, 255);
      fill(this.n, 255, 255);
      noStroke();
      ellipse(this.loc.x, this.loc.y, this.r*2, this.r*2);
    }
  }
  

  this.getSpeed = function() 
  {
    // Scales the speed based on radius of circle with the max radius being 500 (possible decrease if required in future)
    // map(r, .5, 500, -2, -.5)*-1

    if (dist(this.loc.x, this.loc.y, mouseX, mouseY) >= width/4) 
    {
      return map(this.r, .5, 500, -1, -.1)*-1;
    } else 
    {
      return map(dist(this.loc.x, this.loc.y, mouseX, mouseY), 0, width/4, 0, 1)*(map(this.r, .5, 500, -1, -.5)*-1);
    }
  }

  this.getRadius = function() 
  {
    //float ra = map(score, 0, 10000, 10, 100);
    //r = (float) (100 * Math.log((int) score + 20) - 300);
    //r = (float) (10 * Math.log((score)));
    //r = map((float)((100* Math.log((10*score))-500)), 0, 800, 10, 100);
    var ra = Math.sqrt(this.score/PI);
    return ra;
  }

  this.move = function()
  {
    // Moves unless the mouse is a quarter of the radius away from the center of their cell/blob/entity
    if (dist(mouseX, mouseY, this.loc.x, this.loc.y) <= this.r/4) {
      return;
    } else {
      // Determines how much to move x and y locations based on direction of mouse, then uses distance to get an apropraite amount to add so that it doesn't change direction to fast up, down, left or right
      // Then uses speed to adjust the amount x and y change
      var moveX = ((mouseX - this.loc.x) / dist(mouseX, mouseY, this.loc.x, this.loc.y) * this.getSpeed());
      var moveY = ((mouseY - this.loc.y) / dist(mouseX, mouseY, this.loc.x, this.loc.y) * this.getSpeed());
      if (player) {
        //Sets the worlds borders
        if ((this.loc2.x+moveX)-this.r < sqrR && (this.loc2.x+moveX)-this.r > -sqrR) 
        {
          this.loc2.x+=moveX;
        }
        if ((this.loc2.y+moveY)-this.r < sqrR && (this.loc2.y+moveY)-this.r > -sqrR) 
        {
          this.loc2.y+=moveY;
        }
      } else 
      {
        return;
      }
    }
  }
}