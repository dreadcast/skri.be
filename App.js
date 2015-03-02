var ArticleCtrl = require('./Article/Ctrl'),
	ViewManager = require('./Base/ViewManager'),
	_ = require('hidash'),
	Path = require('path'),
	Class = require('./Base/Class');

var startTime = new Date().getTime();
 
var App = Class({
	options: {
		theme: Path.join(__dirname, 'default/theme'),
		pathToBlog: Path.join(__dirname, 'default')
	},
	
	constructor: function(options){
		var pathToBlog = this.options.pathToBlog = Path.resolve('.');
		
		this.setOptions(require(Path.join(pathToBlog, 'package')).config);
		
		this.options.theme = Path.join(pathToBlog, 'node_modules/theme');
		
		this.setOptions(options);
		
		this.articleCtrl = new ArticleCtrl({
			pathToBlog: this.options.pathToBlog,
			template: this.options.templates.article,
			featuredTags: this.options.site.featuredTags
		});
		
		this.viewManager = new ViewManager({
			templates: this.options.templates,
			defaults: {
				site: this.options.site,
				tags: this.articleCtrl.tags
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
			
			cb.call(this)
		}, this);
	},
	
	loadTemplates: function(cb){
		return this.viewManager.loadTemplates(cb);
	},
	
	loadArticles: function(cb){
		this.articleCtrl.browse(Path.join(this.options.pathToBlog, 'data'), function(){
			this.options.site.featuredTags = _.intersection(this.options.site.featuredTags, this.articleCtrl.tags);

			cb();
		}.bind(this));
	},
	
	startServer: function(cb){
		var Server = require('./Base/Server'),
			options = {};
		
			
		_.deepmerge(options, this.options, {
			articleCtrl: this.articleCtrl,
			viewManager: this.viewManager
		});
		
		this.server = new Server(options);
		
		setTimeout(cb, .1);
	}
});

module.exports = App;