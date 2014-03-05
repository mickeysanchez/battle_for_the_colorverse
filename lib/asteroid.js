(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});
  var MovingObject = AsteroidsGame.MovingObject;

  var Asteroid = AsteroidsGame.Asteroid = function Asteroid(pos, vel, rad, color) {
    MovingObject.call(this, pos, vel, rad, color)
  };

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "black";
  Asteroid.RADIUS = 40;

// FACTORY METHOD FOR CREATING RANDOM ASTEROIDS

  Asteroid.randomAsteroid = function(dimX, dimY) {
	// For multiplayer, asteroids will spawn between players
	var x = dimX/2;
    var y = dimY/2;

    var pos = [x, y];

    return new Asteroid(pos, MovingObject.randomVec(), Asteroid.RADIUS, Asteroid.COLOR);
  };

})(this);

