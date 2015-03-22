var chokidar = require('chokidar'),
	Path = require('path'),
	anymatch = require('anymatch'),
	fs = require('fs-extra'),
	recurse = require('fs-recurse'),
	_ = require('lowerdash'),
	s = require('./utils/superscore.string');

module.exports = function(mode){
	var lessUtils = require('./utils/less').init(this.options),
		theme = this.options.theme,
		viewManager = this.viewManager,
		pathToBlog = this.options.pathToBlog,
		exportPath = Path.join(pathToBlog, mode),
		featuredTags = this.options.featuredTags,
		assetMatcher = anymatch([
			/(less|css|twig|js|json)$/
		]),
		templates = [];
	
	function dev(){
		var watcher = chokidar.watch(theme, {
			ignored: [
			//	/\.(json|css|less|js)$/,
				'**/js/**',
				'**/less/**',
				'**/.git',
				'**/.svn',
				'**/.DS_Store'
			]
		}).on('all', function(event, filePath){
			var relativePath = Path.relative(theme, filePath);
			
			if(/\.twig$/.test(filePath)){
				this.viewManager.precompile(filePath);
		
			} else if(/\.css$/.test(filePath)){
				var fileDestPath = Path.join(exportPath, 'asset', relativePath);

				if(event == 'change' || !fs.existsSync(fileDestPath)){
					console.info(event, Path.basename(filePath));
	
					lessUtils.fromFileToFile(filePath, fileDestPath);
				}
			} 
		}.bind(this));
	};
	
	function cleanup(done){
		fs.remove(Path.join(pathToBlog, 'build'), function(err){
			if(err)
				throw new Error(err);

			fs.remove(Path.join(pathToBlog, 'tmp'), function(err){
				if(err)
					throw new Error(err);
				
				done();
			});
		});
		
	}
	
	function compileAll(done){
		return this.viewManager.compileAll(done);
	}
	
	function build(done){
		_.eachAsync([cleanup, copyAssets, compileAll, buildArticle], function(fn, index, cursor){
			fn.call(this, cursor)
		}, done, this);
	};
	
	
	function copyAssets(done){
		function copyAsset(filePath, folder, done){
			var relativePath = Path.relative(theme, filePath);
			
			fs.copy(filePath, Path.join(pathToBlog, folder, relativePath), function(err){
				if(err)
					throw new Error(err);
				
				console.info('\nCopy ' + relativePath + ' to ' + Path.join(folder, relativePath))
				done();
			});
		};
		var ignore = [
			'**/css',
			'**/js',
			'**/less',
			'**/*.js',
			'**/*.css',
			'**/*.less',
			'**/.git',
			'**/.svn',
			'**/.DS_Store'
		];
		recurse(theme, function(path, file, type, cursor){
			var filePath = Path.join(path, file);
// 			console.info(filePath)
			//return setTimeout(cursor, 1)
			
			if(type == 'twig')
				viewManager.copy(filePath, cursor);
				
			else if(type != 'folder')
				copyAsset.call(this, filePath, 'build/asset', cursor);
		}, done, ignore);
	}
	
	function buildArticle(cursor){
		this.articles.each(function(article, i){
			var html = viewManager.render('html', {
				mode: 'article',
				article: article.toJSON(),
				currentTag: _.chain(article.get('tags')).intersection(featuredTags).first().value(),
				template: {
					html: article.template,
					json: function(data){
						delete data.mode;
						delete data.template;
						delete data.site;
						
						return data;
					}
				}
			});
			var destPath = Path.join(pathToBlog, 'build', article.get('url'), 'index.html');
			
			fs.outputFile(destPath, html, function(err){
				if(err)
					throw new Error(err);
					
				console.info('"' + article.get('title') + '" saved to ' + destPath);
				cursor();
			});
		});
	}
	
	eval(mode).call(this);
}