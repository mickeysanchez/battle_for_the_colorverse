(function(root) {
	
  Function.prototype.inherits = function (BaseClass) {
    function Surrogate () {};
    Surrogate.prototype = BaseClass.prototype;
    this.prototype = new Surrogate();
  };
  
})(this);