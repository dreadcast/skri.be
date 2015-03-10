;(function(){
	var _ = require('hidash'),
		Router = require('./Router'),
		fs = require('fs-extra'),
		Path = require('path'),
		Class = require('./Class');
	
	var Server = Class({
		constructor: function(options){
			this.options = _.merge({}, this.options, options);
			
			return this.startRouter();
		},
		
		options: {},
		
		startRouter: function(){	
			var viewManager = this.options.viewManager,
				featuredTags = this.options.featuredTags,
				articleCtrl = this.options.articleCtrl,
				pathToBlog = this.options.pathToBlog,
				router = this.router = new Router({
					pathToBlog: pathToBlog,
					theme: this.options.theme
				});
			
			var postsJsonTpl = this.options.templates.posts.json,
				postsHtmlTpl = this.options.templates.posts.html;
			
			router.on('request', function(path, format, req, res, next){
				if(_.contains(articleCtrl.tags, path))
					return res.end(viewManager.render(format, {
						mode: 'posts',
						posts: articleCtrl.getPostsTagged(path).articles.map(function(article){
							return article.getRaw();
						}),
						currentTag: path,
						template: {
							html: postsHtmlTpl,
							json: function(data){
								data.posts = _.map(data.posts, function(post){
									return _.pick(post, postsJsonTpl);
								});
			
								delete data.mode;
								delete data.template;
			
								return data;
							}
						}
					}));
					
				var article = articleCtrl.getArticle(path);
				article && console.info('req', article.get('created'))
				
				if(article && format == 'static')
					return res.sendfile(Path.join(pathToBlog, 'data', req.url));
					
				if(article)
					return res.end(viewManager.render(format, {
						mode: 'article',
						article: article.getRaw(),
						currentTag: _(article.get('tags')).intersection(featuredTags).first(),
						template: {
							html: article.template,
							json: function(data){
								delete data.mode;
								delete data.template;
								delete data.site;
								
								return data;
							}
						}
					}));
				
				next();
			});
			
			return this;
		},
		
		start: function(){	
			this.router.start(this.options.port);
			
			console.info(this.options.site.title + ' server listening on port ' + this.options.port);
		}
	});
	
	module.exports = Server;
})();