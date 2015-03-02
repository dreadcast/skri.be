var fs = require('fs-extra'),
	Path = require('path'),
	_ = require('hidash');

var fsExtra = {
	extension: function(path){
		try{
			var match = path.match(/\.([a-z|0-9]+)$/);
			
			if(match && match.length > 1)
				return match[1];
			
		} catch(e){
			console.info('\n\n', e);
			console.info(path);
		}
		
		return null;
	},
	
	recurse: function(path, cb, done){
		fs.readdir(path, function(error, dir){
			var dirContent = _.filter(dir, function(file){
				return !file.match(/^\./);
			});
			
			_.eachAsync(dirContent, function(file, index, cursor){				
				var stats = fs.statSync(Path.join(path, file)),
					type;
				
				if(stats.isDirectory()){
					type = 'folder';
					fsExtra.recurse(Path.join(path, file), cb, cursor);
					
					cursor = function(){};
				
				} else if(stats.isFile()){
					type = fsExtra.extension(file);
				}
				
				cb(path, file, type, cursor);
			}, done);
		});
	}
};

module.exports = _.merge(fs, fsExtra);