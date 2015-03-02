exports.start = function(config){
	var Path = require('path'),
		prompt = require('prompt'),
		fs = require('fs'),
		express = require('express'),
		app = express();
	
	app.get('*.svg', function(req, res, next){
		res.setHeader('Content-type', 'image/svg+xml');
		next();
	});
	
	app.get('*', function(rq, rs){
		var path = Path.join(config.blogRoot, 'static') + rq.url,
			indexPath = Path.join(path, 'index.html');
		
		
		if(path.indexOf('?') > -1)
			path = path.split('?')[0];
			
		if(fs.existsSync(indexPath))
			rs.end(fs.readFileSync(indexPath));
			
		else if(fs.existsSync(path))
			rs.end(fs.readFileSync(path));
		
		rs.status(404);
		rs.end(rq.url + ' does not exist');
	});
	
	
	console.log('Test server started on port ' + config.testPort);
	var server = app.listen(config.testPort);
	
	setTimeout(function(){
		prompt.start();
		prompt.get({
			description: 'Open test in browser?',
			default: 'y',
			name: 'open'
		}, function(err, result){
			if(result.open == 'y')
				require('open')('http://localhost:' + config.testPort);
	
			setTimeout(function(){
				prompt.start();
		
				var closeServer = function(){
					prompt.get({
						description: 'Press "x" key to close server',
						name: 'exit'
					}, function(err, result){
						if(result.exit == 'x')
							server.close();
						
						else
							closeServer();
					});
				}
		
				closeServer();
			}, 999);
		});
	}, 199);
};