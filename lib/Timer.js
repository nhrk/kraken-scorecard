/* A very naive timer */
function Timer(name){
	if( !(this instanceof Timer) ){
		return new Timer(name);
	}
	this.name = name;
	this.start();
}

Timer.prototype.start = function(){
	this.start = new Date();
};

Timer.prototype.end = function(){
	this.end = new Date();
	return this.time();
};

Timer.prototype.time = function(){
	return {
		name : this.name,
		time : (this.end - this.start) + ' ms'
	};
};

module.exports = Timer;