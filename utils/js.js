var fs = require('fs'),
	cheerio = require('cheerio'),
	uglify = require('uglify-js');

exports.init = function(config){
	var uglyString = function(sourceCode, exportPath){
			return uglify.minify(sourceCode, {
				//outSourceMap: exportPath + '.map',
				fromString: true,
				mangle: true,
				squeeze: true
			});
		},
		
		updatePath = function(sourceCode, selector, cb){
			var dom = cheerio.load(sourceCode),
				jss = dom(selector || 'head script');
			
			jss.each(function(i, js){
				var js = dom(js),
					src = js.attr('src'),
					jsSourceCode;
				
				if(src){					
					jsSourceCode = fs.readFileSync(path, 'utf8');
					
					js.attr('src', src);
					cb(src, jsSourceCode);
				}
			});
			
			return dom.html();
		},
		
		combine = function(sourceCode, exportPath, selector){
			var dom = cheerio.load(sourceCode),
				jss = dom(selector || 'head script'),
				combined = '',
				fileList = [],
				previousElement = dom(jss[0]).prev();
		
			jss.each(function(i, js){
				var js = dom(js),
					src = js.attr('src');
				
				if(!js.hasClass('remove-me') && js.hasClass('combine')){
					if(src){
						src = src.replace(/^\/asset/, config.blogRoot + '/theme');
						combined += fs.readFileSync(src, 'utf8');
							
					} else {
						combined += dom(js).text();
					}
				}
				
				if(js.hasClass('remove-me') || js.hasClass('combine'))
					js.remove();

				combined += ";";
	
				
			});
			
			combined = uglyString(combined, exportPath);
				
			dom(previousElement).after('<script src="' + exportPath + '"></script>');
			
			return {
				html: dom.html(),
				js: combined.code
			};
		};
	
	exports.uglyString = uglyString;
	exports.updatePath = updatePath;
	exports.combine = combine;
	
	return exports;
}