(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Asteroid = AsteroidsGame.Asteroid = function Asteroid(pos, vel, rad, color) {
    AsteroidsGame.MovingObject.call(this, pos, vel, rad, color)
  };

  Asteroid.COLOR = "grey";
  Asteroid.RADIUS = 40;

  Asteroid.inherits(AsteroidsGame.MovingObject);

  Asteroid.randomAsteroid = function(dimX, dimY) {
	
	// asteroids never spawn on top of ship 
	
	var quadrants = [Math.random() * (dimX/3.5),
					 (dimX - (Math.random() * (dimX/3.5)))];
	
	var x = quadrants[Math.floor(Math.random() * 2)];
    var y = quadrants[Math.floor(Math.random() * 2)];

    var pos = [x, y];

    function randomVec() {
      var x = (Math.random() * 1) - (Math.random() * 1);
      var y = (Math.random() * 1) - (Math.random() * 1);
      var vel = [x, y];
      return vel;
    };

    return new Asteroid(pos, randomVec(), Asteroid.RADIUS, Asteroid.COLOR);
  };

})(this);

