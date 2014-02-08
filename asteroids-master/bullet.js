(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Bullet = AsteroidsGame.Bullet = function Bullet(pos, vel, game) {
    this.game = game;
    AsteroidsGame.MovingObject.call(this, pos, vel, Bullet.RADIUS, Bullet.COLOR);
  };

  Bullet.RADIUS = 3;
  Bullet.COLOR = "black";
  Bullet.SPEED = 20;

  Bullet.inherits(AsteroidsGame.MovingObject);

  Bullet.prototype.hitAsteroids = function () {
    var that = this;
    this.game.asteroids.forEach(function (asteroid) {
      if (that.isCollidedWith(asteroid)) {
        that.game.removeAsteroid(asteroid);
        that.game.removeBullet(that);
      }
    });
  };

  Bullet.prototype.move = function () {
    AsteroidsGame.MovingObject.prototype.move.call(this);
    this.hitAsteroids();
  }

})(this);