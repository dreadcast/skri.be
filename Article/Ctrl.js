var _ = require('hidash'),
	fs = require('./../utils/fs'),
	//ArticleModel = require('./Model'),
// 	ArticleCollection = require('./Collection'),
	Article = require('./Model'),
	Path = require('path'),
	Class = require('./../Base/Class');
	
var listArticles = function(articles, properties){
	return _.merge({
		articles: articles,
		total: articles.length
	}, properties);
};

var ArticleCtrl = Class({
	constructor: function(options){
		this.options = _.merge({}, this.options, options);
// 		this.setOptions(options);
		
		this.items = [];
/*
		this.articles = new ArticleCollection({
			pathToBlog: this.options.pathToBlog,
			template: this.options.template
		});
		this.items = this.articles.items;
		
*/
		return this;
	},
	
	tags: [],
	
	options: {},
	
	browse: function(root, cb){
		fs.recurse(root, function(path, filename, type, cursor){
			if('data.md' == filename){
				var article = new Article({}, {
					pathToBlog: this.options.pathToBlog,
					template: this.options.template
				});
				
				this.addItem(article);
				
				article.on('change:tags', function(data){
					this.addTags(article.get('tags'));
				}.bind(this));
				
				article.parse(Path.join(path, filename), cursor);
				
			} else {
				setTimeout(cursor, 1);
			}
		}.bind(this), cb);
	},
	
	addItem: function(article){
		this.items.push(article);
		
		this.emit('add', article);

		return this;
	},
	
	getPosts: function(){
		return listArticles(this.items);
	},
	
	getPostsTagged: function(tag){
		var items = this.getPosts(),
			articles = items.articles.filter(function(article){
				return _.contains(article.get('tags'), tag);
			});
		
		return listArticles(articles, {
			tag: tag
		});
	},

	getFeaturedPosts: function(){
		var items = this.getPosts(),
			articles = _.filter(items.articles, function(article){
				return article.get('featured');
			});
		
		return listArticles(articles);
	},
	
	sortBy: function(field){
		var items = this.getPosts(),
			articles = _.sortBy(items.articles, field);
		
		return listArticles(articles);
	},
	
	groupBy: function(field){
		var items = this.getPosts(),
			articles = _.groupBy(items.articles, field);
		
		return listArticles(articles);
	},
	
	getRange: function(pager, pageIndex, perPage){
		var 
			// first range's article index
			index = (pageIndex || 0) * perPage,
			
			// {perPage} articles from index
			articles = pager.articles.slice(index, perPage);
		
		return listArticles(articles, {
			index: index,
			pager: {
				total: Math.ceil(articles.length / perPage),
				index: pageIndex
			}
		});
	},
	
	addTags: function(tags){
		var previousTags = this.tags;
		
		this.tags = _(this.tags).union(tags).uniq().sort().value();
		
		if(previousTags != this.tags)
			this.emit('changetag', this.tags);
		
		return this;	
	},
	
	getArticle: function(url){
		return _.find(this.items, function(item){
			return item.get('url') == url;
		});
	}
});

module.exports = ArticleCtrl;