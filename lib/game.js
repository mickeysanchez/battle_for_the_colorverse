(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Game = AsteroidsGame.Game = function Game(ctx) {
  	var centerX = Game.DIM_X/2;
  	var centerY = Game.DIM_Y/2;

    this.ctx = ctx;
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    
	this.ship = new AsteroidsGame.ComputerShip(
		[Game.SHIP1_POS[0], Game.SHIP1_POS[1]], 1, Game.SHIP1_COLOR
	);
	
	this.ship2 = new AsteroidsGame.ComputerShip(
		[Game.SHIP2_POS[0], Game.SHIP2_POS[1]], 2, Game.SHIP2_COLOR
	);
    
	this.bullets = [[],[],[]];
	
	this.bindKeyHandlers();
	this.spacePressed = false;
  };

// GAME CONSTANTS //

  Game.DIM_X = 500; // Game width
  Game.DIM_Y = 500; // Game height
  Game.FPS = 30;
  Game.NUM_ASTEROIDS = 4; // This + game's level number determines number of asteroids.
  Game.MAX_BULLETS = 2;
  Game.A_COLORS = ["#685aff", "#b259ff", "#BC8F8F", "#ffb25a"]; // Asteroid colors
  Game.SHIP1_POS = [50, 450];
  Game.SHIP2_POS = [450, 50];
  Game.SHIP1_COLOR = "#00c4ff";
  Game.SHIP2_COLOR = "#FF0000";
  Game.LINE_WIDTH = 3;

// FACTORY METHODS //

  Game.populateAsteroids = function (game) {
	  var asteroids = [];
	  
	  for (var i = 0; i < (Game.NUM_ASTEROIDS + game.level); i++) {
		  asteroids.push(AsteroidsGame.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
	  };

	  return asteroids;
  };

// MAIN GAME FLOW FUNCTIONS //

  Game.prototype.start = function () {
	  this.ship = new AsteroidsGame.Ship(
		[Game.SHIP1_POS[0], Game.SHIP1_POS[1]], 1, Game.SHIP1_COLOR
	  );
	  AsteroidsGame.intervalId = setInterval(this.step.bind(this), Game.FPS);	
  };
  
  Game.prototype.startScreen = function() {
	  this.ship = new AsteroidsGame.ComputerShip(
		[Game.SHIP1_POS[0], Game.SHIP1_POS[1]], 1, Game.SHIP1_COLOR
	  );
	  AsteroidsGame.intervalId = setInterval(this.startScreenStep.bind(this), Game.FPS);
  };
  
  Game.prototype.startScreenStep = function() {
      this.move();
  	  this.isOutOfBounds();
      this.checkCollisions();
      this.draw();
	   
	  var ctx = this.ctx;
	  
	  ctx.fillStyle = "black";
	  ctx.globalAlpha = 0.6;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.globalAlpha = 1;
	  
	  ctx.save();
	  
	  ctx = this.ctx;
      ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
      ctx.font = 40 + "pt Montserrat";
	  ctx.shadowColor = "black";
	  ctx.shadowOffsetX = 4;
	  ctx.shadowOffsetY = 4;
   	  ctx.textAlign = "center";
      ctx.fillText(("BATTLE FOR THE"), (Game.DIM_X/2), Game.DIM_Y/2-100);
	  
      ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
      ctx.font = 49 + "pt Montserrat";
      ctx.fillText(("COLORVERSE"), (Game.DIM_X/2), Game.DIM_Y/2-40);
	  
      ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
      ctx.font = 16 + "pt Montserrat";
      ctx.fillText(("Press -space- to begin."), (Game.DIM_X/2), Game.DIM_Y/2 + 40);
	  
	  ctx.restore();
	  
	  this.checkStartButton();
  };
  
  Game.prototype.checkStartButton = function () {
  	  if (navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0]) {
  	    	var gamepad = navigator.webkitGetGamepads()[0];
  	    	if (gamepad.buttons.some(function (el) { return el === 1 })) {
  			   this.spacePressed = true ;
  		    };
  	  };
	
	  if (this.spacePressed) {
	  		this.stop();
			this.reset();
			this.spacePressed = false;
			this.start();
	  };
  };

  Game.prototype.step = function () {
  	// Gamepad support : props to Marcin Wichary at html5rocks.com
	// it needs to go here because its constantly polling the gamepad
	// rather than waiting for an event 
	if (navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0]) {
		var gamepad = navigator.webkitGetGamepads()[0];
	
	    this.ship.vel[1] = gamepad.axes[1]*5;
		this.ship.vel[0] = gamepad.axes[0]*5;	
	
		if (gamepad.buttons.some(function (el) { return el === 1 })) {
			this.fireBullet(this.ship);
		};
	};
	
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
	
	this.drawScores(ctx);
  };

  Game.prototype.reset = function () {
    this.ctx.restore();
	this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    this.ship.pos = [Game.SHIP1_POS[0], Game.SHIP1_POS[1]];
	this.ship2.pos = [Game.SHIP2_POS[0], Game.SHIP2_POS[1]];
	this.ship.isDestroyed = false;
	this.ship2.isDestroyed = false;
    this.ship.vel = [0,0];
	this.ship2.vel = [0,0];
	this.ship.score = 0;
	this.ship2.score = 0;
    this.bullets = [[],[],[]];
  };

  Game.prototype.stop = function() {
    clearInterval(AsteroidsGame.intervalId);
  };

// HELPER FUNCTIONS //

  Game.prototype.drawScores = function (ctx) {
	  ctx.fillStyle = this.ship.color;
	  ctx.font = 12 + "pt Montserrat";
	  ctx.textAlign = "start";
	  ctx.fillText(("BLUES: " + this.ship.score), 20, 20);
	  
	  ctx.fillStyle = this.ship2.color;
	  ctx.font = 12 + "pt Montserrat";
	  ctx.textAlign = "end";
	  ctx.fillText(("REDS: " + this.ship2.score), (Game.DIM_X - 20), 20);
  };

  Game.prototype.proclaimWinner = function () {
	  this.stop();

	  var winningColor;

	  if (this.ship.isDestroyed) {
		  winningColor = this.ship2.color;
		  victoryMessage = "You have been defeated!"
	  } else if (this.ship2.isDestroyed) {
		  winningColor = this.ship.color;
		  victoryMessage = "You are victorious!"
	  } else if (this.asteroids.length === 0) {
		  if (this.ship.score > this.ship2.score) {
			  winningColor = this.ship.color;
			  victoryMessage = "You won by points!";
		  } else {
			  winningColor = this.ship2.color;
			  victoryMessage = "You lost by points!";
		  };
	  };
	  
	  ctx.save();
	  ctx = this.ctx;
      ctx.fillStyle = winningColor;
      ctx.font = 20 + "pt Montserrat";
	  ctx.shadowColor = "black";
	  ctx.shadowOffsetX = 4;
	  ctx.shadowOffsetY = 4;
   	  ctx.textAlign = "center";
      ctx.fillText((victoryMessage), (Game.DIM_X/2), Game.DIM_Y/2-50);

	  var that = this;
	  setTimeout(function () { 
		  that.reset.bind(this);
		  that.startScreen(); 
	  }, 2000);
  }

  Game.prototype.hasWon = function () {
	  if (this.ship.isDestroyed) {
		  return true;
	  } else if (this.ship2.isDestroyed) {
		  return true;
	  } else if (this.asteroids.length === 0 && this.ship.score != this.ship2.score){
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
	// Thanks to Thomas Carroll for this fix!  
	  
    var movingObjects = [this.ship, this.ship2].concat(this.asteroids);
	 
	movingObjects.forEach(function(obj) {
	    if (obj.pos[0] > (Game.DIM_X + obj.radius)) {
	      obj.pos[0] -= Game.DIM_X + (obj.radius * 2);
	    };

	    if (obj.pos[0] < -obj.radius) {
	      obj.pos[0] += Game.DIM_X + (obj.radius * 2);
	    };

	    if (obj.pos[1] > (Game.DIM_Y + obj.radius)) {
	      obj.pos[1] -= Game.DIM_Y + (obj.radius * 2);
	    };

	    if (obj.pos[1] < -obj.radius) {
	      obj.pos[1] += Game.DIM_Y + (obj.radius * 2);
	    };
	});
  };

})(this);