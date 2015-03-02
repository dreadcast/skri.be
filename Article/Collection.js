var Collection = require('./../Base/Collection'),
	Article = require('./Model'),
	Class = require('./../Class'),
	Path = require('path');

module.exports = Class({
	inherits: Collection,
	
	addItem: function(item){
		var article = new Article({
			pathToBlog: this.options.pathToBlog,
			template: this.options.template
		});
		
// 		this.parent('addItem', article);
// 		Collection.prototype.addItem.call(this, article);
		this.items.push(article);
		
		return article;
	}
});