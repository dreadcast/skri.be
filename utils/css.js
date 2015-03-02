var fs = require('fs'),
	cheerio = require('cheerio');

exports.init = function(config){
	var less = require('./utils/less').init(config);
	
	return {		
		combine: function(sourceCode, exportPath, cb){
			var dom = cheerio.load(sourceCode),
				csss = dom('head link[rel=stylesheet]'),
				combined = '';
			
			
			csss.each(function(i, css){
				var css = dom(css),
					src = css.attr('href');
				
				if(src){					
					if(!css.hasClass('remove-me'))
						src = src.replace(/^\/asset/, config.blogRoot + '/theme');
						combined += fs.readFileSync(src, 'utf8');
						
				} else {
					combined += dom(css).text();
				}
				
				css.remove();
	
				combined += ";";
	
				
			});
			
			dom('head').append('<link rel="stylesheet" type="text/css" href="' + exportPath + '">');
			
			combined = less.fromString(combined, function(compiled){
				cb({
					html: dom.html(),
					css: compiled
				});
			});
		}
	};
}