(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});
  var MovingObject = AsteroidsGame.MovingObject;

  var Asteroid = AsteroidsGame.Asteroid = function Asteroid(pos, vel, rad, color) {
    MovingObject.call(this, pos, vel, rad, color)
  };
  
  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "grey";
  Asteroid.RADIUS = 40;

// FACTORY METHOD FOR CREATING RANDOM ASTEROIDS
  
  Asteroid.randomAsteroid = function(dimX, dimY) {
	// ASTEROIDS NEVER SPAWN IN THE CENTER
	// currently this only supports a square canvas
	var quadrants = [Math.random() * (dimX/3.5),
					 (dimX - (Math.random() * (dimX/3.5)))];
	
	var x = quadrants[Math.floor(Math.random() * 2)];
    var y = quadrants[Math.floor(Math.random() * 2)];

    var pos = [x, y];

    return new Asteroid(pos, MovingObject.randomVec(), Asteroid.RADIUS, Asteroid.COLOR);
  };

})(this);

