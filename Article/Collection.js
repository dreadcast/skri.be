(function(){
	var Collection = require('backbone').Collection,
		ArticleModel = require('./Model'),
		Path = require('path');
	
	var ArticleCollection = Collection.extend({
		model: ArticleModel
	});
	
	module.exports = ArticleCollection;
})();