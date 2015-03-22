var fs = require('fs-extra'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	Path = require('./path'),
	less = require('less'),
	_ = require('hidash');
	
exports.init = function(config){
	var autoprefixPlugin = new LessPluginAutoPrefix({
		browsers: ['last 2 versions']
	});
	
	function fromString(origCode, cb, path){
		less.render(origCode, {
			plugins: [autoprefixPlugin],
			paths: [
				config.theme + '/bower_components/bootstrap/less',
				config.theme + '/less',
			],
			filename: path,
			compress: config.mode != 'dev'          // Minify CSS output
	    }, function(err, output){
			if(err){
				console.error('Error parsing ' + path)
				throw new Error(err);
			}
			
			cb(output.css);
		});
	};
	
	function fromFile(path, cb){
		fs.readFile(path, 'utf8', function(err, sourceCode){
			if(err)
				return console.error(err);
			
			fromString(sourceCode, cb, path);
		});
	};
	
	function fromFileToFile(src, dest, done){
		return fromFile(src, function(css){
			saveFile(css, dest, done, src);
		});
	};
	
	function combine(files, dest, done){
		var combined = '';
								
		_.eachAsync(files, function(file, i, cursor){
			fromFile(file, function(css){
				combined += css;
				console.info('Lessified ' + file);
				
				cursor();
			});
		}, function(){
			saveFile(combined, dest, done);
		});
	};
	
	function saveFile(css, dest, done, src){
		fs.outputFile(dest, css, function(err){
			if(err)
				throw new Error('Error saving ' + src);
			
			console.log((src ? Path.basename(src) : 'File') + ' was saved to ' + dest);
			
			if(_.isFunction(done))
				done();
		});
	};
	
	exports.combine = combine;
	exports.fromFileToFile = fromFileToFile;
	exports.fromString = fromString;
	exports.fromFile = fromFile;
	
	return exports;
}