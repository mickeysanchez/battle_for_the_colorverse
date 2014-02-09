(function(root) {

	// Allows classes to inherit from each other.
	Function.prototype.inherits = function (BaseClass) {
		function Surrogate () {};
		Surrogate.prototype = BaseClass.prototype;
		this.prototype = new Surrogate();
	};
  
})(this);