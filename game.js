(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Game = AsteroidsGame.Game = function Game(ctx) {
    this.ctx = ctx;
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    this.ship = new AsteroidsGame.Ship();
    this.bullets = [];
    this.score = 0;

  };

  Game.DIM_X = 500; // Game width
  Game.DIM_Y = 500; // Game height
  Game.FPS = 30; // Game speed
  Game.NUM_ASTEROIDS = 10; // This + game's level number determines number of asteroids.
  
  Game.A_COLORS = ["orange", "green", "blue", "black"] // Asteroid colors

  Game.populateAsteroids = function (game) {
	  var asteroids = [];
	  for (var i = 0; i < (Game.NUM_ASTEROIDS + game.level); i++) {
		  asteroids.push(AsteroidsGame.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
	  };

	  return asteroids;
  };

  Game.prototype.draw = function () {
    this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);

    var that = this;
    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(that.ctx);
    });

    this.drawScore(that.ctx);

    this.ship.draw(that.ctx);

    this.bullets.forEach(function(bullet) {
      bullet.draw(that.ctx);
    });

  };

  Game.prototype.drawScore = function (ctx) {
    ctx.fillStyle = "black";
    ctx.font = 10 + "pt Arial";
    ctx.fillText(("score: " + this.score), (Game.DIM_X/2-25), 15);
  };

  Game.prototype.move = function () {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move();
    });

    this.ship.move();

    this.bullets.forEach(function(bullet) {
      bullet.move();
    });
  };

  Game.prototype.step = function () {
    this.move();
	this.isOutOfBounds();
    this.checkCollisions();
    this.draw();
    this.hasWon();
  };

  Game.prototype.start = function () {
    this.bindKeyHandlers();
    this.showLevel();
  };

  Game.prototype.hasWon = function () {
    if (this.asteroids.length < 1) {
      this.level += 1;
      this.asteroids = Game.populateAsteroids(this);
	  this.ship.pos = [Game.DIM_X/2, Game.DIM_Y/2];
	  this.ship.vel = [0,0];
	  this.showLevel();
    }
  };
  
  Game.prototype.showLevel = function () {
	  clearInterval(AsteroidsGame.intervalId);
	  this.ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
	  
	  var game = this;
	  setTimeout(function () {
	  	AsteroidsGame.intervalId = setInterval(game.step.bind(game), Game.FPS);
	  }, 1500);
	 
      ctx.fillStyle = "black";
      ctx.font = 11 + "pt Arial";
      ctx.fillText(("Level: " + this.level), (Game.DIM_X/2-27), (Game.DIM_Y/2));
  }

  Game.prototype.checkCollisions = function() {
    var that = this;
    this.asteroids.forEach(function(asteroid) {
       if (that.ship.isCollidedWith(asteroid)) {
         that.reset();
       }
    })
  }

  Game.prototype.reset = function () {
    this.level = 1;
    this.asteroids = Game.populateAsteroids(this);
    this.ship.pos = [Game.DIM_X/2, Game.DIM_Y/2];
    this.ship.vel = [0,0];
    this.bullets = [];
    this.score = 0;
  }

  Game.prototype.stop = function() {
    clearInterval(this.AsteroidsGame.intervalId);
  }

  Game.prototype.fireBullet = function() {
    var bullet = this.ship.fireBullet();

    if (bullet) {
      this.bullets.push(bullet)
    };
  }

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
  }

  Game.prototype.removeBullet = function (bullet) {
    var index = this.bullets.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.bindKeyHandlers = function() {
    var that = this;
    key("up", function () { that.ship.power([0,-1])});
    key("down", function () { that.ship.power([0,1])});
    key("left", function () { that.ship.power([-1,0])});
    key("right", function () { that.ship.power([1,0])});

    key("space", function () { that.fireBullet() });
  }

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
  };

})(this);