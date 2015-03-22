var Path = require('path'),
	_ = require('hidash'),
	fs = require('./../utils/fs'),
	swig = require('swig'),
	useref = require('node-useref'),
	htmlminifier = require('html-minifier'),
	swigExtras = require('swig-extras'),
	recurse = require('fs-recurse'),
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
	
	combine: function(assetsObj, done){
		var theme = this.options.theme,
			pathToBlog = this.options.pathToBlog,
			lessUtils = require('./../utils/less').init(this.options);
		
		// Define a combine callback passed to precompile, receives useref asset list
		_.eachAsync(assetsObj, function(assets, type, index, cursor){
			_.eachAsync(assets, function(assetList, combineFileName, index, cursor2){
				var sourceFiles = assetList.assets.map(function(file){
					return file.replace(/\/asset/, theme);
				});
				
				if(type == 'css')
					lessUtils.combine(sourceFiles, Path.join(pathToBlog, 'build', combineFileName), cursor2);

				if(type == 'js'){
					console.info(sourceFiles, Path.join(pathToBlog, 'build', combineFileName));
					setTimeout(cursor2, 1);
				}
			}, cursor);
		}, function(){
			setTimeout(done, 1)
		});
	},
	
	copy: function(path, done){
		fs.readFile(path, {
			encoding: 'utf8'
		}, function(err, inputHtml){
			var relativePath = Path.relative(this.options.theme, path),
				result = useref(inputHtml),
				resultHtml = result[0],
				outputPath = Path.join(this.options.pathToBlog, 'tmp', relativePath);
				
 			fs.outputFileSync(outputPath, resultHtml);
			
			this.combine(result[1], done);
		
			console.log('\nTemplate ' + outputPath + ' was copied to TMP.');
		}.bind(this));
	},
	
	compileAll: function(done){
		var pathToTmp = Path.join(this.options.pathToBlog, 'tmp');
		
		recurse(pathToTmp, function(path, file, type, cursor){
			if(type == 'twig'){
				var absPath = Path.join(path, file),
					relativePath = Path.relative(pathToTmp, absPath);

				this.templates[relativePath] = swig.compileFile(absPath, {
					filename: absPath
				});
			}
			
			setTimeout(cursor, 1);
		}.bind(this), done);
	},
	
	precompile: function(path){
		var relativePath = Path.relative(this.options.theme, path);
		
		this.templates[relativePath] = swig.compileFile(path, {
			filename: path
		});
		console.log('Template ' + relativePath + ' was compiled.');
	},
	
	renderHtml: function(data){
		_.merge(data, this.options.defaults);
					
		if(this.options.minify)
			return this.minify(this.templates[data.template.html](data));

		//console.info(this.templates[data.template.html](data));
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