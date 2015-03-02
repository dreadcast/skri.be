var express = require('express'),
	app = express(),
	fs = require('fs-extra'),
	Path = require('path'),
	Class = require('./Class');

var Router = Class({
	options: {},
	
	constructor: function(options){
		this.setOptions(options);
		this.routes = {};
		
		this.app = app;
		
		return this;
	},
	
	startStatic: function(){
		
/*
		var feed = require('./urss').init(config, Post.posts);
		app.get('/feed.rss', function(req, res){
			res.setHeader('Content-type', 'application/rss+xml');
			res.end(feed);
		});
*/
		var theme = this.options.theme,
			lessUtils = require('./../utils/less').init(this.options);
		
		app.get('*.svg', function(req, res, next){
			res.setHeader('Content-type', 'image/svg+xml');
			next();
		});
		
		
		// LESS stuff
		app.get('*.css', function(req, res, next){
			res.setHeader('Content-type', 'text/css');
			
			var path = Path.join(theme, req.url.replace(/^\/asset/, ''));
			
			if(fs.existsSync(path))
				lessUtils.fromFile(path, function(css){
					res.end(css);
				});
			
			else
				next();
		});
		// Assets
		app.get('/asset/*', function(req, res, next){
			res.end(fs.readFileSync(Path.join(theme, req.params[0])));
		});
		/*
		// Bower components
		app.get('/bower_components/*', function(req, res, next){
			res.end(fs.readFileSync(Path.join(theme, 'theme', 'bower_components', req.params[0])));
		});
		*/
		
		return this;
	},
	
	start: function(port){
		app.get(/^\/([a-zA-Z0-9\-_\/]+)\//, function(req, res, next){
			this.emit('request', req.params[0], 'static', req, res, next);
		}.bind(this));
		
		app.get(/^\/([a-zA-Z0-9\-_\/]+)$/, function(req, res, next){
			this.emit('request', req.params[0], 'html', req, res, next);
		}.bind(this));
		
		app.get(/^\/([a-zA-Z0-9\-_\/]+)\.ajax\.html$/, function(req, res, next){
			this.emit('request', req.params[0], 'ajax', req, res, next);
		}.bind(this));
		
		app.get(/^\/([a-zA-Z0-9\-_\/]+)\.json$/, function(req, res, next){
			this.emit('request', req.params[0], 'json', req, res, next);
		}.bind(this));
		
		this.startStatic();
		
		app.listen(port);
	}
});

module.exports = Router;