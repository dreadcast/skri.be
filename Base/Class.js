;(function(){
	var _ = require('hidash'),
		Prime = require('prime'),
		Options = require('./Options'),
		Parent = require('./Parent'),
		Emitter = require('prime/emitter');
	
	var Class = function Class(proto){
		_.each(proto, function(method, name){
			if(_.isFunction(method))
				method.$name = name;
		});
		
		proto.mixin = _.union(proto.mixin || [], [Emitter, Options, Parent]);
		
		return Prime(proto);
	};
	
	module.exports = Class;
})();