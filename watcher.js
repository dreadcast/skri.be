var chokidar = require('chokidar'),
	Path = require('path'),
	fs = require('fs-extra'),
	recurse = require('fs-recurse'),
	_ = require('lowerdash'),
	s = require('superscore.string');

module.exports = function(){
	var lessUtils = require('./utils/less').init(this.options),
		theme = this.options.theme,
		viewManager = this.viewManager,
		pathToBlog = this.options.pathToBlog,
		exportPath = Path.join(pathToBlog, 'dev'),
		featuredTags = this.options.featuredTags,
		templates = [];
	
	(function dev(){
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
	}).call(this);
}