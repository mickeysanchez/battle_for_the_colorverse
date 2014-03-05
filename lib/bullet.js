(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});
  var MovingObject = AsteroidsGame.MovingObject;

  var Bullet = AsteroidsGame.Bullet = function Bullet(pos, vel, game, shipId) {
	this.shipId = shipId;
    this.game = game;
    MovingObject.call(this, pos, vel, Bullet.RADIUS, Bullet.COLOR);
  };

  Bullet.inherits(MovingObject);

  Bullet.RADIUS = 3;
  Bullet.COLOR = "white";
  Bullet.SPEED = 20;

  Bullet.prototype.move = function () {
    AsteroidsGame.MovingObject.prototype.move.call(this);
    this.hitAsteroids();
	  this.hitOtherShip();
	  this.outOfBounds();
  };

  Bullet.prototype.hitAsteroids = function () {
    var that = this;
    this.game.asteroids.forEach(function (asteroid) {
      if (that.isCollidedWith(asteroid)) {
        that.game.removeAsteroid(asteroid);
        that.game.removeBullet(that);
      }
    });
  };

  Bullet.prototype.hitOtherShip = function (otherShip) {
	  var otherShip;
	  if (this.shipId === 1) {
		  otherShip = this.game.ship2;
	  } else {
		  otherShip = this.game.ship;
	  };

	  if (this.isCollidedWith(otherShip)) {
		  otherShip.isDestroyed = true;
	  }
  };

  Bullet.prototype.outOfBounds = function () {
	if (Math.abs(this.pos[0]) > AsteroidsGame.Game.DIM_X || Math.abs(this.pos[1]) > AsteroidsGame.Game.DIM_Y || this.pos[0] < 0 || this.pos[1] < 0) {
	  	this.game.removeBullet(this);
	}
  };

})(this);

