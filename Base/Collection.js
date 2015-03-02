var _ = require('hidash'),
	Class = require('./Class');

module.exports = Class({
	
	options: {},
	
	constructor: function(options){
		this.items = [];
		
		this.setOptions(options);
		
/*
		_.each(['groupBy', 'indexBy', 'sortBy', 'find', 'each'], function(method){
			this[method] = _[method];
		}, this);
*/
		
		return this;
	},
	
	remove: function(filter){
		
	},
	
	addItem: function(item){
		return this.items.push(item);
	},
	
	addItems: function(items){
		_.each(items, this.addItem, this);
		
		return this;
	}
});