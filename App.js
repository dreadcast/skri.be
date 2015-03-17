var ArticleCollection = require('./Article/Collection'),
	ArticleModel = require('./Article/Model'),
	ViewManager = require('./Base/ViewManager'),
	fs = require('./utils/fs'),
	_ = require('hidash'),
	Path = require('path'),
	Class = require('./Base/Class');

var startTime = new Date().getTime();
 
var App = Class({
	options: {
		theme: Path.join(__dirname, 'default/theme'),
		pathToBlog: Path.join(__dirname, 'default')
	},
	
	constructor: function(themeName, pathToTheme){
		var pathToBlog = this.options.pathToBlog = Path.resolve('.'),
			theme = pathToTheme ? require(Path.join(pathToBlog, pathToTheme)) : module.parent.require(themeName);
		
		this.setOptions(theme.config)
			.setOptions(require(Path.join(pathToBlog, 'package')).config);
		
		this.options.theme = pathToTheme ? pathToTheme : Path.join(module.parent.paths[0], themeName);
		
		this.articles = new ArticleCollection([], {});
 		this.articles.setTemplates(this.options.templates);
		
		this.viewManager = new ViewManager({
			templates: this.options.templates,
			defaults: {
				site: this.options.site,
				tags: this.articles.tags
			},
			theme: this.options.theme
		});
		
		return this;
	},
	
	start: function(cb){
		_.eachAsync(['startServer', 'loadArticles', 'loadTemplates'], function(fn, i, cursor, arr){
			this[fn](cursor);

			console.info(fn + '... done');
		}, function(){
			var duration = Math.round(((new Date().getTime() - startTime) / 1000) * 10) / 10;

			console.info('Blog ready in ' + duration + ' sec !');
			
			cb.call(this);
			
			return;
			
			require('./gulpfile')({
				build: Path.join(this.options.pathToBlog, 'build'),
				scripts: [
					Path.join(this.options.theme, 'js/**/*.js'),
					Path.join('!', this.options.theme, 'js/Object.js'),
					Path.join(this.options.theme, 'widget/**/*.js')
				]
			});
		}, this);
	},
	
	loadTemplates: function(cb){
		return this.viewManager.loadTemplates(cb);
	},
	
	loadArticles: function(cb){
		var absPath = Path.join(this.options.pathToBlog, 'data');
		fs.recurse(absPath, function(path, filename, type, cursor){
			if('data.md' == filename){
				var article = new ArticleModel({
					id: Path.relative(absPath, path),
					template: this.options.templates.article
				}, {
					pathToBlog: this.options.pathToBlog
				});
				
				this.articles.add(article);
				
				article.on('change:tags', function(data){
					this.articles.addTags(article.get('tags'));
				}.bind(this));
				
				article.parse(Path.join(path, filename), cursor);
				
			} else {
				setTimeout(cursor, .1);
			}
		}.bind(this), function(){
			console.info('Articles loaded')
// 			console.info(this.articles.pluck('title'))
			cb();
		}.bind(this));
	},
	
	startServer: function(cb){
		var Server = require('./Base/Server'),
			options = {};
		
			
		_.merge(options, this.options, {
			articleCtrl: this.articles,
			viewManager: this.viewManager
		});
		
		this.server = new Server(options);
		
		setTimeout(cb, .1);
	}
});

module.exports = App;
