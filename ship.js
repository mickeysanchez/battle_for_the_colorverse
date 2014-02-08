(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Ship = AsteroidsGame.Ship = function Ship() {
    AsteroidsGame.MovingObject.call(this, [250,250], [0,0], Ship.RADIUS, Ship.COLOR);
  };

  Ship.RADIUS = 10;
  Ship.COLOR = "red";

  Ship.inherits(AsteroidsGame.MovingObject);

  Ship.prototype.power = function (impulse) {
    if (Math.abs(this.vel[0]) < 20 && Math.abs(this.vel[1]) < 20) {
      this.vel[0] += impulse[0];
      this.vel[1] += impulse[1];

      // need this to recover from top speed
      if (this.vel[0] === 20) {
        this.vel[0] -= 1;
      } else if (this.vel[0] === -20) {
        this.vel[0] += 1;
      } else if (this.vel[1] === 20) {
        this.vel[1] -= 1;
      } else if (this.vel[1] === -20) {
        this.vel[1] += 1;
      }
    }
  };

  Ship.prototype.fireBullet = function() {
    if (this.vel[0] != 0 || this.vel[1] != 0 ) {
      var xVel = this.vel[0];
      var yVel = this.vel[1];

      var shipSpeed = Math.sqrt((xVel*xVel) + (yVel*yVel));
      var multiplier = AsteroidsGame.Bullet.SPEED / shipSpeed;

      var vel = [xVel * multiplier, yVel * multiplier];
      var pos = [this.pos[0], this.pos[1]];

      return new AsteroidsGame.Bullet(pos, vel, AsteroidsGame.currentGame);
    }
  }

  Ship.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

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

})(this);