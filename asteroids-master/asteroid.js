(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var Asteroid = AsteroidsGame.Asteroid = function Asteroid(pos, vel, rad, color) {
    AsteroidsGame.MovingObject.call(this, pos, vel, rad, color)
  };

  Asteroid.COLOR = "grey";
  Asteroid.RADIUS = 40;

  Asteroid.inherits(AsteroidsGame.MovingObject);

  Asteroid.randomAsteroid = function(dimX, dimY) {
	  // asteroids should spawn at random x & y greater than 350 and less than 150
	  var x = Math.random() * dimX;
    var y = Math.random() * dimY;

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

