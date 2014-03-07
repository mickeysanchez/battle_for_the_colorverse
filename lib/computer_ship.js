(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});
  var MovingObject = AsteroidsGame.MovingObject;
  var Game = AsteroidsGame.Game;
  var Ship = AsteroidsGame.Ship;

  var ComputerShip = AsteroidsGame.ComputerShip = 
  function ComputerShip(pos, id, color) {
    Ship.call(this, pos, id, color);
  };

  ComputerShip.inherits(Ship);

  ComputerShip.AVOIDANCE_RADIUS = 5
  
  ComputerShip.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  };
  
  ComputerShip.prototype.isCollidedWith = function (otherObject) {
	this.avoidance(otherObject)
	
    var positionX = this.pos[0];
    var positionY = this.pos[1];

    var otherPositionX = otherObject.pos[0];
    var otherPositionY = otherObject.pos[1];

    var xDistance = Math.abs(positionX - otherPositionX);
    var yDistance = Math.abs(positionY - otherPositionY);

    var distance = Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));

    return (distance < (this.radius + otherObject.radius)) ? true : false;
  };

  ComputerShip.prototype.draw = function (ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    ctx.arc (this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);

    ctx.stroke();

    this.drawVectorLine(ctx);
	
	// uncomment this to see the computerShip's avoidance radius
	// this.CollisionAvoiderLine(ctx);
  };
  
  ComputerShip.prototype.CollisionAvoiderLine = function (ctx) {
      ctx.strokeStyle = this.color;
      ctx.beginPath();

      ctx.arc (
		  this.pos[0], 
		  this.pos[1], 
		  this.radius*ComputerShip.AVOIDANCE_RADIUS, 
		  0, 
		  2 * Math.PI,
		  false
	  );

      ctx.stroke();
  }
  
  MovingObject.prototype.avoidance = function (otherObject) {
    var positionX = this.pos[0];
    var positionY = this.pos[1];

    var otherPositionX = otherObject.pos[0];
    var otherPositionY = otherObject.pos[1];
	
	var diff_X = ((positionX - otherPositionX)/Game.DIM_X)*25
	var diff_Y = ((positionY - otherPositionY)/Game.DIM_Y)*25

    var xDistance = Math.abs(positionX - otherPositionX);
    var yDistance = Math.abs(positionY - otherPositionY);

    var distance = Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));

    if (distance < (this.radius*ComputerShip.AVOIDANCE_RADIUS + otherObject.radius)) {
		
		// left and right
    	this.vel[0] = diff_X;
		
		// up and down
		this.vel[1] = diff_Y;
    } else {
    	
		if (Math.random() < 0.005) {
			this.vel[0] = Math.random() < 0.5 ? 5 : -5;
		};
		
		if (Math.random() < 0.005) {
			this.vel[1] = Math.random() < 0.5 ? 5 : -5;
		};
		
    };
	
	if (Math.random() < 0.01) {
		AsteroidsGame.currentGame.fireBullet(this);
	};
  };

})(this);