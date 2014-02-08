(function(root) {
  var AsteroidsGame = root.AsteroidsGame = (root.AsteroidsGame || {});

  var MovingObject = AsteroidsGame.MovingObject = function MovingObject(pos, vel, radius, color) {

    this.pos    = pos;
    this.vel    = vel;
    this.radius = radius;
    this.color  = color;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  };

  MovingObject.prototype.draw = function (ctx) {
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
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var positionX = this.pos[0];
    var positionY = this.pos[1];

    var otherPositionX = otherObject.pos[0];
    var otherPositionY = otherObject.pos[1];

    var xDistance = Math.abs(positionX - otherPositionX);
    var yDistance = Math.abs(positionY - otherPositionY);

    var distance = Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));

    if (distance < (this.radius + otherObject.radius)) {
      console.log("true");
    };

    return (distance < (this.radius + otherObject.radius)) ? true : false;
  };

  Function.prototype.inherits = function (BaseClass) {
    function Surrogate () {};
    Surrogate.prototype = BaseClass.prototype;
    this.prototype = new Surrogate();
  };

})(this);

