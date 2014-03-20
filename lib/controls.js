(function(root) {
	var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {})
	var Game = AsteroidsGame.Game
	
// KEY HANDLERS //
  Game.prototype.bindKeyHandlers = function() {
	var that = this;

    $('body').keydown(function (event) {
	  if (event.keyCode === 32) {
  		event.preventDefault(); 
        that.fireBullet(that.ship)
	  }
	  else if (event.keyCode === 38) {
		event.preventDefault(); 
        that.ship.vel[1] = -5;
      }
      else if (event.keyCode === 40) {
	    event.preventDefault();
        that.ship.vel[1] = 5;
      }
      else if (event.keyCode === 37) {
		event.preventDefault();  
        that.ship.vel[0] = -5;
      }
      else if (event.keyCode === 39) {
	    event.preventDefault();
        that.ship.vel[0] = 5;
      }
    });

    $('body').keyup(function (event) {
      if (event.keyCode === 38) {
	    event.preventDefault();
        that.ship.vel[1] = 0;
      }
      else if (event.keyCode === 40) {
		event.preventDefault();  
        that.ship.vel[1] = 0;
      }
      else if (event.keyCode === 37) {
		event.preventDefault();  
        that.ship.vel[0] = 0;
      }
      else if (event.keyCode === 39) {
	    event.preventDefault();
        that.ship.vel[0] = 0;
      }
    });

  };
	  
})(this);