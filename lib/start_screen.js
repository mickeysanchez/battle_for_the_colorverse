(function(root) {
	var AsteroidsGame = root.AsteroidsGame = ( root.AsteroidsGame || {} );
	var Game = AsteroidsGame.Game;
	
    Game.prototype.startScreen = function() {
	  	this.ship = new AsteroidsGame.ComputerShip(
	  	    [Game.SHIP1_POS[0], Game.SHIP1_POS[1]], 1, Game.SHIP1_COLOR
	  	);
	  	
		AsteroidsGame.intervalId = setInterval(this.startScreenStep.bind(this), Game.FPS);
    };
  
    Game.prototype.startScreenStep = function() {
        this.move();
    	this.isOutOfBounds();
        this.checkCollisions();
        this.draw();
	   
  	  	var ctx = this.ctx;
	  	
  	  	ctx.fillStyle = "black";
  	  	ctx.globalAlpha = 0.6;
  	  	ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  	  	ctx.globalAlpha = 1;
	  
  	  	ctx.save();
	  
  	  	ctx = this.ctx;
        ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
        ctx.font = 40 + "pt Montserrat";
  	  	ctx.shadowColor = "black";
  	  	ctx.shadowOffsetX = 4;
  	  	ctx.shadowOffsetY = 4;
     	ctx.textAlign = "center";
        ctx.fillText(("BATTLE FOR THE"), (Game.DIM_X/2), Game.DIM_Y/2-100);
	  
        ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
        ctx.font = 49 + "pt Montserrat";
        ctx.fillText(("COLORVERSE"), (Game.DIM_X/2), Game.DIM_Y/2-40);
	  
        ctx.fillStyle = AsteroidsGame.Game.A_COLORS[Math.floor(Math.random()*3)];
        ctx.font = 16 + "pt Montserrat";
        ctx.fillText(("Press -space- to begin."), (Game.DIM_X/2), Game.DIM_Y/2 + 40);
	  
  	  	ctx.restore();
	  
  	  	this.checkStartButton();
    };
  
    Game.prototype.checkStartButton = function () {
    	  if (navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0]) {
    	    	var gamepad = navigator.webkitGetGamepads()[0];
    	    	if (gamepad.buttons.some(function (el) { return el === 1 })) {
    			   this.spacePressed = true ;
    		    };
    	  };
	
	  	  if (this.spacePressed) {
	  	  		this.stop();
	  			this.reset();
	  			this.spacePressed = false;
	  			this.start();
	  	  };
    };
	
})(this);