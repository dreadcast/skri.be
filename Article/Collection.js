(function(){
	var _ = require('hidash'),
		Path = require('path'),
		SuperCollection = require('./../Base/Collection'),
		ArticleModel = require('./Model');

	var listArticles = function(articles, properties){
		return _.merge({
			articles: articles,
			total: articles.length
		}, properties);
	};

	var ArticleCollection = SuperCollection.extend({
		model: ArticleModel,
		
		initialize: function(){
			this.on('add', function(model){
				model.set('template', this.getTemplate('article'));
			});
		},
		
		templates: {},
		
		tags: [],
		
		addTags: function(tags){
			var previousTags = this.tags;
			
			this.tags = _(this.tags).union(tags).uniq().sort().value();
			
			if(previousTags != this.tags)
				this.trigger('changetag', this.tags);
			
			return this;	
		},
		
		getTemplate: function(part){
			return this.templates[part];
		},
		
		setTemplates: function(templates){
			_.merge(this.templates, templates);
		},
	
		getPostsTagged: function(tag){
			var articles = this.filter(function(article){
				return _.contains(article.get('tags'), tag);
			});
			
			return listArticles(articles, {
				tag: tag
			});
		}
	});
	
	module.exports = ArticleCollection;
})();