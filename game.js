(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Game = AsteroidsGame.Game = function Game(ctx) {
  	var centerX = Game.DIM_X/2;
  	var centerY = Game.DIM_Y/2;   
	  
    this.ctx = ctx;
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    this.ship = new AsteroidsGame.Ship(Game.SHIP1_POS, 1, "red");
	this.ship2 = new AsteroidsGame.Ship(Game.SHIP2_POS, 2, "blue");
    this.bullets = [[],[],[]];
    this.score = 0;

  };
  
// GAME CONSTANTS //

  Game.DIM_X = 500; // Game width
  Game.DIM_Y = 500; // Game height
  Game.FPS = 30; 
  Game.NUM_ASTEROIDS = 0; // This + game's level number determines number of asteroids.
  Game.MAX_BULLETS = 2;
  Game.A_COLORS = ["orange", "green", "#DAA520", "black"]; // Asteroid colors
  Game.SHIP1_POS = [50, 450];
  Game.SHIP2_POS = [450, 50];

// FACTORY METHODS //
  
  Game.populateAsteroids = function (game) {
	  var asteroids = [];
	  for (var i = 0; i < (Game.NUM_ASTEROIDS + game.level); i++) {
		  asteroids.push(AsteroidsGame.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
	  };

	  return asteroids;
  };
  
// KEY HANDLERS //
  
  Game.prototype.bindKeyHandlers = function() {
    var that = this;
    key("up", function ()    { that.ship.power([0,-1])});
    key("down", function ()  { that.ship.power([0,1])});
    key("left", function ()  { that.ship.power([-1,0])});
    key("right", function () { that.ship.power([1,0])});

    key("space", function () { that.fireBullet(that.ship) });
	
    key("w", function () { that.ship2.power([0,-1])});
    key("s", function () { that.ship2.power([0,1])});
    key("a", function () { that.ship2.power([-1,0])});
    key("d", function () { that.ship2.power([1,0])});

    key("c", function () { that.fireBullet(that.ship2) });
  };
  
// MAIN GAME FLOW FUNCTIONS // 
  
  Game.prototype.start = function () {
  	this.bindKeyHandlers();
	AsteroidsGame.intervalId = setInterval(this.step.bind(this), Game.FPS);
  };
  
  Game.prototype.showWinner = function () {
	  clearInterval(AsteroidsGame.intervalId);
	  this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
	  
	  var game = this;
	  setTimeout(function () {
	  	AsteroidsGame.intervalId = setInterval(game.step.bind(game), Game.FPS);
	  }, 1500);
	 
      ctx.fillStyle = "black";
      ctx.font = 11 + "pt Arial";
      ctx.fillText(("Level: " + this.level), (Game.DIM_X/2-27), (Game.DIM_Y/2));
  };
  
  Game.prototype.step = function () {
    this.move();
	this.isOutOfBounds();
    this.checkCollisions();
    this.draw();
    if (this.hasWon()) {
    	this.proclaimWinner();
    }
  };
  
  Game.prototype.move = function () {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move();
    });

    this.ship.move();
	this.ship2.move();

    this.bullets[1].forEach(function(bullet) {
      bullet.move();
    });
	
    this.bullets[2].forEach(function(bullet) {
      bullet.move();
    });
  };

  Game.prototype.draw = function () {
    this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);

    var that = this;
    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(that.ctx);
    });

    this.ship.draw(that.ctx);
	this.ship2.draw(that.ctx)

    this.bullets[1].forEach(function(bullet) {
      bullet.draw(that.ctx);
    });

    this.bullets[2].forEach(function(bullet) {
      bullet.draw(that.ctx);
    });
  };
  
  Game.prototype.reset = function () {
	this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    this.ship.pos = [Game.SHIP1_POS[0], Game.SHIP1_POS[1]];
	this.ship2.pos = [Game.SHIP2_POS[0], Game.SHIP2_POS[1]];
	this.ship.isDestroyed = false;
	this.ship2.isDestroyed = false;
    this.ship.vel = [0,0];
	this.ship2.vel = [0,0];
    this.bullets = [[],[],[]];
    this.score = 0;
	AsteroidsGame.intervalId = setInterval(this.step.bind(this), Game.FPS);
	
  };

  Game.prototype.stop = function() {
    clearInterval(AsteroidsGame.intervalId);
  };

// HELPER FUNCTIONS // 

  Game.prototype.proclaimWinner = function () {
	  this.stop();
	  setTimeout(this.reset.bind(this), 2000);
  }

  Game.prototype.hasWon = function () {
	  if (this.ship.isDestroyed) {
		  return true;
	  } else if (this.ship2.isDestroyed) {
		  return true;
	  } else {
		  return false;
	  }
  };
  
  Game.prototype.checkCollisions = function() {
    var that = this;
    this.asteroids.forEach(function(asteroid) {
       if (that.ship.isCollidedWith(asteroid)) {
         that.ship.isDestroyed = true;
       } else if (that.ship2.isCollidedWith(asteroid)) {
	     that.ship2.isDestroyed = true;
       }
    })
  };

  Game.prototype.fireBullet = function(ship) {
	if (this.bullets[ship.id].length < Game.MAX_BULLETS) {
      var bullet = ship.fireBullet();
    };
	
    if (bullet) {
      this.bullets[ship.id].push(bullet)
    };
  };

  Game.prototype.removeAsteroid = function (asteroid) {
    var index = this.asteroids.indexOf(asteroid);

	var halfRadius = asteroid.radius/2;
    this.splitAsteroid(asteroid.pos, halfRadius);

    this.score += 1;

    this.asteroids.splice(index, 1);
  };

  Game.prototype.splitAsteroid = function (pos, radius) {
	if (radius+1 > AsteroidsGame.Asteroid.RADIUS/4) {
      var randColorNum = Math.floor(Math.random() * 4);
      var randColorNum2 = Math.floor(Math.random() * 4);
      var color1 = Game.A_COLORS[randColorNum];
      var color2 = Game.A_COLORS[randColorNum2];

      var randVel1 = [(Math.random() * 2 - Math.random() * 2),
                      (Math.random() * 2 - Math.random() * 2)];

      var randVel2 = [(Math.random() * 2 - Math.random() * 2),
              (Math.random() * 2 - Math.random() * 2)];

      var a1 = new AsteroidsGame.Asteroid([pos[0], pos[1]], randVel1, radius, color1);

      var a2 = new AsteroidsGame.Asteroid([pos[0 ], pos[1]], randVel2, radius, color2);

      this.asteroids.push(a1);
      this.asteroids.push(a2);
    }
	
  };

  Game.prototype.removeBullet = function (bullet) {
    var index = this.bullets[bullet.shipId].indexOf(bullet);
    this.bullets[bullet.shipId].splice(index, 1);
  };

  Game.prototype.isOutOfBounds = function () {
	this.asteroids.forEach(function(asteroid) {
		  var x = asteroid.pos[0];
		  var y = asteroid.pos[1];

		  if (x > Game.DIM_X || x < 0 || y > Game.DIM_Y || y < 0) {
			  asteroid.pos = [Game.DIM_X - x, Game.DIM_Y - y];
		  };
	});

	var x = this.ship.pos[0];
	var y = this.ship.pos[1];

	if (x > Game.DIM_X || x < 0 || y > Game.DIM_Y || y < 0) {
		  this.ship.pos = [Game.DIM_X - x, Game.DIM_Y - y];
	};
	
	var x = this.ship2.pos[0];
	var y = this.ship2.pos[1];

	if (x > Game.DIM_X || x < 0 || y > Game.DIM_Y || y < 0) {
		  this.ship2.pos = [Game.DIM_X - x, Game.DIM_Y - y];
	};
  };

})(this);