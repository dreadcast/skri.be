var fs = require('fs'),
	htmlminifier = require('html-minifier'),
	_ = require('./bower_components/hidash/src/hidash.js'),
	deepmerge = require('deepmerge'),
	cheerio = require('cheerio');

exports.init = function(config){
	//var siteConf = JSON.parse(fs.readFileSync(config.path.www + 'config.json', 'utf8'));
	
	var minify = function(req, res){
			var url = req.url.split('?')[0];
			
			url = url.replace(/\/([a-z|0-9|_|\-]*)\/?$/i, '/$1/index.html');
			
			var sourceCode = fs.readFileSync(config.path.dashboard + url, 'utf8');
			res.end(execMinify(sourceCode));
		},
		
		execMinify = function(sourceCode, rootFile, cb){		
			// simple minify and code injection
			sourceCode = includeAll(sourceCode);
			sourceCode = applyConfigVars(sourceCode);
			sourceCode = getTemplates(sourceCode);			
			
			sourceCode = minifyHtml(sourceCode);
			sourceCode = sourceCode.replace(/(<\/?)ko-template/g, '$1script');			
			
			if(typeOf(cb) == 'function')
				cb(sourceCode);
			
			else
				return sourceCode;
		},
		
		getTemplates = function(sourceCode){
			var tmpResults,
				includes = [],
				re = /<!--\s*#template\s+id="([^"]*)"\s*-->/gm;
		
			while((tmpResults = re.exec(sourceCode)) !== null){
				var tpl = '<script type="text/tmp-html" id="' + tmpResults[1] + '">';
					
				if(fs.existsSync(config.path.dashboard + 'app/' + tmpResults[1] + '.html'))
					tpl +=  minifyHtml(fs.readFileSync(config.path.dashboard + 'app/' + tmpResults[1] + '.html', 'utf8'));
				
				else if(fs.existsSync(config.path.shared + 'app/' + tmpResults[1].replace('/qbt-shared', '') + '.html'))
					tpl +=  minifyHtml(fs.readFileSync(config.path.shared + 'app/' + tmpResults[1].replace('/qbt-shared', '') + '.html', 'utf8'));
				
				tpl += '</script>';
				
				sourceCode = sourceCode.replace(tmpResults[0], tpl);
			}
			
			return sourceCode;
		},
		
		minifyHtml = function(sourceCode){
			sourceCode = htmlminifier.minify(sourceCode, {
				removeComments: false,
				removeCommentsFromCDATA: false,
				collapseWhitespace: true,
				collapseBooleanAttributes: false,
				removeAttributeQuotes: false,
				removeEmptyAttributes: false
			});
			
			return sourceCode;
		},
		
		getIncludes = function(sourceCode){
			var tmpResults,
				includes = [],
				re = /<!--\s*#include\s+file="([^"]*)"\s*-->/gm;
		
			while((tmpResults = re.exec(sourceCode)) !== null)
				includes.push({
					str: tmpResults[0],
					url: tmpResults[1]
				});

			return includes;
		},
		
		include = function(sourceCode, include){			
			if(fs.existsSync(config.path.dashboard + include.url))
				var content = fs.readFileSync(config.path.dashboard + include.url, 'utf8');
			
			else if(fs.existsSync(config.path.shared + include.url.replace('/shared', '')))
				var content = fs.readFileSync(config.path.shared + include.url.replace('/shared', ''), 'utf8');
			
			return sourceCode.replace(include.str, minifyHtml(content));
		},
		
		includeAll = function(sourceCode){
			var includes = getIncludes(sourceCode);
			
			for(var i = 0; i < includes.length; i++)
				sourceCode = include(sourceCode, includes[i]);
			
			return sourceCode;
		},
		
		applyConfigVars = function(sourceCode){
			var re = /\{qbt-var\.([a-z|A-Z|0-9|\.]+)\}/m;
			
			while((tmpResults = re.exec(sourceCode)) !== null){
				var confStr = _(config.vars).getFromPath(tmpResults[1]);
				if(confStr != null)
					sourceCode = sourceCode.replace(new RegExp(tmpResults[0], 'gm'), confStr);
			}
			
			return sourceCode;
		}
		
	
	exports.minify = minify;
	exports.execMinify = execMinify;
	exports.include = include;
	exports.getIncludes = getIncludes;
	
	return exports;
};