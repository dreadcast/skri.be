var Path = require('path'),
	_ = require('hidash'),
	fs = require('./../utils/fs'),
	swig = require('swig'),
	htmlminifier = require('html-minifier'),
	swigExtras = require('swig-extras'),
	superswig = require('./../utils/superswig'),
	Class = require('./Class');
	
	
swigExtras.useFilter(swig, 'markdown');		
swigExtras.useFilter(swig, 'truncate');

swig.setFilter('length', superswig.length);		

swig.setDefaults({ cache: false });

module.exports = Class({
	templates: {},
	
	options: {
		defaults: {}
	},
	
	constructor: function(options){
		this.setOptions(options);
		
		swig.setDefaults(this.options.defaults);
		
		return this;
	},
	
	loadTemplates: function(cb){
		fs.recurse(this.options.theme, function(path, filename, type, cursor){
			if(type == 'twig'){
				var fullPath = Path.join(path, filename);
				this.templates[Path.relative(this.options.theme, fullPath)] = swig.compileFile(fullPath);
			}
			
			setTimeout(cursor, .1);
		}.bind(this), cb);
	},
	
	renderHtml: function(data){
		_.merge(data, this.options.defaults);
					
		if(this.options.minify)
			return this.minify(this.templates[data.template.html](data));
		
		return this.templates[data.template.html](data);
	},
	
	renderAjax: function(data){
		_.merge(data, this.options.defaults);
					
		if(this.options.minify)
			return this.minify(this.templates[this.options.templates.article.ajax](data));
		
		return this.templates[this.options.templates.article.ajax](data);
	},
	
	renderJson: function(data){
		return JSON.stringify(data.template.json(_.clone(data, true)));//this.templates[data.template.json](data);
	},
	
	render: function(mode, data){
		if(mode == 'html')
			return this.renderHtml(data);
			
		if(mode == 'ajax')
			return this.renderAjax(data);
			
		if(mode == 'json')
			return this.renderJson(data);
	},
	
	minify: function(content){
		return htmlminifier.minify(content, {
			removeComments: false,
			removeCommentsFromCDATA: false,
			collapseWhitespace: true,
			collapseBooleanAttributes: false,
			removeAttributeQuotes: false,
			removeEmptyAttributes: false
		});
	}
});