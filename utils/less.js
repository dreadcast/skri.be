var fs = require('./fs'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	Path = require('./path'),
	less = require('less');
	
exports.init = function(config){
	var autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]}),
		lessVariables = {},
		lessFileToGet = [
			'less/color',
			'less/qbt-grid',
			'less/type',
			'less/geometry',
			'bower_components/bootstrap/less/mixins/vendor-prefixes',
			'bower_components/bootstrap/less/mixins/gradients'
		],
		getVariables = function(){
			var result = '';
			
			lessFileToGet.forEach(function(file){
				var lessFile = Path.join(config.theme, file + '.less');
				
				if(fs.existsSync(lessFile))
					result += "\n" + fs.readFileSync(lessFile, 'utf8');
			});
			
			return result;
		},
		
		fromString = function(origCode, cb, path){
			if(config.mode == 'dev')
				lessVariables = getVariables();
				
			less.render(lessVariables + "\n" + origCode, {
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
		},
		
		fromFile = function(path, cb){
			fs.readFile(path, 'utf8', function(err, sourceCode){
				if(err)
					return console.error(err);
				
				fromString(sourceCode, cb, path);
			});
		};
	
	lessVariables = getVariables();
	
	exports.lessVariables = lessVariables;
	exports.fromString = fromString;
	exports.fromFile = fromFile;
	
	return exports;
}