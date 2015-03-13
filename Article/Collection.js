(function(){
	var _ = require('hidash'),
		Path = require('path'),
		Collection = require('backbone').Collection/*
,
		ArticleModel = require('./Model')
*/;
	
	var ArticleCollection = Collection.extend({
// 		model: ArticleModel,
		
		initialize: function(){
			this.on('add', function(model){
// 				model = model.attributes;
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
		}
	});
	
	module.exports = ArticleCollection;
})();