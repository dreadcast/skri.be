"use strict";

var Prime = require('prime'),
	_ = require('hidash');

var Options = Prime({
	setOptions: function(options){
		var defaultOptions = {}
		
		_.deepmerge(defaultOptions, _.cloneDeep(this.options), options);
		
		this.options = defaultOptions;
		
		return this;
	}	
});

module.exports = Options;
