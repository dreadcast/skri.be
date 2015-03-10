exports.build = function(config, Post, force){
	var templates = {
			partial: {},
			tpl: {}
		},
		prompt = require('prompt'),
		Path = require('path'),
		fs = require('fs'),
		http = require('http'),
		mootools = require('mootools'),
		querystring = require('querystring'),
		htmlminifier = require('html-minifier'),
		swig = require('swig'),
		swigExtras = require('swig-extras'),
		superswig = require('./superswig'),
		_ = require('./bower_components/hidash/src/hidash.js'),
		fileUtils = require('./file-utils'),
		css = require('./css-utils').init(config),
		js = require('./js-utils').init(config),
		superString = require('./string-utils'),
		
		setCachePath = function(fileContent){
			return fileContent.replace(/\/LONGLIFE_CACHE_PATH/g, '/' + cacheFolderName);
		},
		
		cacheFolderName = superString.random(),
		cachePath = Path.join(config.blogRoot, '/static/', cacheFolderName),
		
		tmpFolderName = '___' + superString.random(),
		tmpPath = Path.join(config.blogRoot, 'TMP', tmpFolderName),
		
		combineJsCss = function(fileContent, cb){
			console.info('\nCombining JS');
			var sourceCode = js.combine(fileContent, '/asset/js/all.js');
			
			fileUtils.create(Path.join(config.blogRoot, '/static/asset/js/all.js'), sourceCode.js);
			
			console.info('Combining CSS');
			sourceCode = css.combine(sourceCode.html, '/asset/css/all.css', function(sourceCode){
				fileUtils.create(Path.join(config.blogRoot, '/static/asset/css/all.css'), sourceCode.css);
					
				cb(sourceCode.html, sourceCode.js, sourceCode.css);
			});
		},
		
		setTemplates = function(cb){
			console.info('\nSetting templates');
			
			var tpls = fs.readdirSync(Path.join(config.blogRoot, 'theme/tpl')),
				partials = fs.readdirSync(Path.join(config.blogRoot, 'theme/partial'));
			
			tpls.each(function(file){
				fileUtils.copy(Path.join(config.blogRoot, '/theme/tpl/', file), Path.join(tmpPath, 'tpl'));
			});
			partials.each(function(file){
				fileUtils.copy(Path.join(config.blogRoot, '/theme/partial/', file), Path.join(tmpPath, 'partial'));
			});
			
			var source = fs.readFileSync(Path.join(tmpPath, '/tpl/default.twig'), 'utf8');
			combineJsCss(source, function(html, js, css){
				fileUtils.createSync(Path.join(tmpPath, '/tpl/default.twig'), html);
				
				compileTemplates('tpl');
				compileTemplates('partial');
								
				cb();
			});
			
			
			return;
		},
		
		compileTemplates = function(part){
			console.info('\nCompiling ' + (part == 'tpl' ? 'templates' : 'partials'));
			
			var pathToTpl = Path.join(tmpPath, part),
				tpls = fs.readdirSync(pathToTpl);
			
			tpls.each(function(twig){
				var precompiled = swig.compileFile(Path.resolve(Path.join(pathToTpl, twig)));
				
				templates[part][twig.split('.')[0]] = function(data){					
					return htmlminifier.minify(precompiled(data), {
						removeComments: false,
						removeCommentsFromCDATA: false,
						collapseWhitespace: true,
						collapseBooleanAttributes: false,
						removeAttributeQuotes: false,
						removeEmptyAttributes: false
					});
				}
			});
		},
		
		buildArticle = function(){
			console.info('\n');
			
			_(Post.posts).each(function(article){
				var destFolder = Path.join(config.blogRoot, 'static', article.url),
					data = Post.getArticleInfo(article.url),
					staticHtml = templates.tpl.article(data);

				fileUtils.create(Path.join(destFolder, '/index.html'), staticHtml);
				
				var data = Post.getArticleInfo(article.url, 'json'),
					staticJson = JSON.stringify({
						json: data,
						html: templates.partial.article({
							article: data
						})
					});
					
				fileUtils.create(Path.join(config.blogRoot, 'static', article.url + '.json'), staticJson, function(err){
					if(err)
						console.info('Failed generating ' + data.title);
					
					else
						console.info('Build article ' + data.title + ' : OK');
				});
				
				fileUtils.recurse(Path.join(config.blogRoot, 'data', article.url), function(path, file, type, depth){
					switch(type){
						case 'md':
						case 'folder':
							break;
						
						default:
							fileUtils.copy(Path.join(path, file), destFolder);
							break;
					}
				});
			});
		},
		
		buildPosts = function(){
			console.info('\n');			
			
			_(Post.tags).each(function(tag){
				console.log('Building posts tagged ' + tag);
								
				var pagesCount = Post.countPostsTagged(tag);
			
				for(var i = 0; i < pagesCount; i++){
					console.info('Building posts tagged ' + tag + '#' + i);	
					
					var jsonPath = i > 0 ? tag + '/' + i + '.json' : tag + '.json',
						staticJson = JSON.stringify(Post.getPostsInfo(tag, i, 'list'));
						
					fileUtils.create(Path.join(config.blogRoot, 'static', jsonPath), staticJson);
					
					var htmlPath = i > 0 ? i + '/index.html' : 'index.html',
						staticHtml = templates.tpl.tag(Post.getPostsInfo(tag, i));
					
					fileUtils.create(Path.join(config.blogRoot, 'static', tag, htmlPath), staticHtml);					
				}
			});
		},
		
		buildHome = function(){
			console.info('\nBuilding home page');
			var staticHtml = templates.tpl.home({
				posts: Post.getFeaturedPosts('list'),
				site: config.site,
				mode: 'tags'
			});
			
			fileUtils.create(Path.join(config.blogRoot, 'static/index.html'), staticHtml);
		},
		
		copyAsset = function(){
			console.info('\nCopying assets');
			
			fileUtils.recurse(Path.join(config.blogRoot, 'theme'), function(path, file, type, depth){
				var destFolder = path.replace(Path.join(config.blogRoot, 'theme'), Path.join(config.blogRoot, 'static/asset'));
				
				if(!_(['folder', 'less', 'css', 'twig', 'js']).contains(type))
					fileUtils.copy(Path.join(path, file), destFolder, function(err){
						if(err instanceof Error)
							console.info('Failed copying ' + Path.join(path, file) + ' to ' + destFolder);
						
						else
							console.info('Copy ' + Path.join(path, file).replace(config.blogRoot, '') + ' to ' + destFolder.replace(config.blogRoot, '').replace('/static', ''));
					});
			});
			
		},
		
		buildRss = function(){
			var feed = require('./urss').init(config, Post.posts);
			
			fileUtils.create(Path.join(config.blogRoot, 'static/feed.rss'), feed);
		};
	
	var build = function(){
		setTemplates(function(){
			buildHome();		
			buildPosts();
			copyAsset();
			setTimeout(buildArticle, 99);
			setTimeout(buildRss, 199);
			
			setTimeout(function(){
				require('rimraf')(Path.join(config.blogRoot, 'TMP'), function(err){
					if(!err)
						console.log('TMP dir removed', Path.join(config.blogRoot, 'TMP'));
				});
			}, 999);
			
			setTimeout(function(){
				var schema = {
					description: 'Would you like to test the build?',
					default: 'y',
					name: 'test'
				};
				prompt.start();
				prompt.get(schema, function(err, result){
					if(result.test == 'y')
						require('./test').start(config);
				});
			}, 2999);
		});
		
	};
	
	if(force)
		require('rimraf')(Path.join(config.blogRoot, 'static'), function(err){
			if(!err)
				build();
			console.log('Static stuff removed', Path.join(config.blogRoot, 'TMP'));
		});
	
	else
		build();
}