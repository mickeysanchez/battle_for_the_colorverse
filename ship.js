(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});
  var MovingObject = AsteroidsGame.MovingObject;
  var Game = AsteroidsGame.Game;
  
  var Ship = AsteroidsGame.Ship = function Ship(pos, id) {
	this.id = 1;
    this.isDestroyed = false;
    MovingObject.call(this, pos, [0,0], Ship.RADIUS, Ship.COLOR);
  };
  
  Ship.inherits(MovingObject);

  Ship.RADIUS = 10;
  Ship.COLOR = "red";
  Ship.MAX_SPEED = 20;
  
// DRAW THE SHIP //

  Ship.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc (this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);

    ctx.fill();

    this.drawVectorLine(ctx);
  };

  Ship.prototype.drawVectorLine = function (ctx) {
	var xVel = this.vel[0];
	var yVel = this.vel[1];

	var shipSpeed = Math.sqrt((xVel*xVel) + (yVel*yVel));
	var multiplier = AsteroidsGame.Bullet.SPEED / shipSpeed;

	var vel = [xVel * multiplier, yVel * multiplier];
	
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo((this.pos[0] + vel[0]), (this.pos[1] + vel[1]));
    ctx.stroke();
  }
  
// MOVE THE SHIP //

  Ship.prototype.power = function (impulse) {
    // enforce a maximum speed
    if (Math.abs(this.vel[0]) < Ship.MAX_SPEED && Math.abs(this.vel[1]) < Ship.MAX_SPEED) {
      this.vel[0] += impulse[0];
      this.vel[1] += impulse[1];

      // need this to recover from top speed
      if (this.vel[0] === Ship.MAX_SPEED) {
        this.vel[0] -= 1;
      } else if (this.vel[0] === -Ship.MAX_SPEED) {
        this.vel[0] += 1;
      } else if (this.vel[1] === Ship.MAX_SPEED) {
        this.vel[1] -= 1;
      } else if (this.vel[1] === -Ship.MAX_SPEED) {
        this.vel[1] += 1;
      }
    }
  };
  
// FIRE BULLETS //

  Ship.prototype.fireBullet = function() {
	// must be moving to fire
    if (this.vel[0] != 0 || this.vel[1] != 0 ) {
      var xVel = this.vel[0];
      var yVel = this.vel[1];

      var shipSpeed = Math.sqrt((xVel*xVel) + (yVel*yVel));
      var multiplier = AsteroidsGame.Bullet.SPEED / shipSpeed;

      var vel = [xVel * multiplier, yVel * multiplier];
      var pos = [this.pos[0], this.pos[1]];

      return new AsteroidsGame.Bullet(pos, vel, AsteroidsGame.currentGame, this.id);
    }
  }

})(this);