import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import express from 'express';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';

export default function(Writenode){
	let server = express(),
		articles = Writenode.getService('articles'),
		views = Writenode.getService('views'),
		assets = Writenode.getService('assets'),
		{ pathToTheme, pathToBlog } = Writenode.getService('conf');

	function parseRequest(request){
		let path = request.params[0],
			ext = Path.extname(path),
			params = {
				path: path.replace(ext, ''),
				type: ext.replace('.', '') || 'html'
			};

		return { path, params }
	}

	function serveArticles(request, response, next){
		let { path, params } = parseRequest(request),
			responseData = {};

		if(articles.tags.indexOf(params.path) > -1){
			var filteredArticles = articles
				.toJSON()
				.filter(article => Lowerdash.contains(article.tags, params.path));

			responseData.articles = views.renderJsonList(filteredArticles, articles.defaultTemplates.posts[params.type]);

			response.json(responseData);

		} else {
			return next();
		}

	}
	function serveArticle(request, response, next){
		let { path, params } = parseRequest(request),
			article = articles.find({
				id: params.path
			});

		if(article){
			return views.render(article.get('templates')[params.type], {
				article: article.toJSON()
			})
				.then(html => response.end(html));

			responseData.article = views.renderJson(article.toJSON(), article.get('templates'));

		} else {
			return next();
		}
	}

	function serveAsset(request, response, next){
		assets.process(Path.join(pathToTheme, request.params[0]))
			.then(processed => response.end(processed));
	}

	function serveMedia(request, response, next){
		let path = request.params[0],
			absBlogPath = Path.join(pathToBlog, 'data', path);

		if(fs.existsSync(absBlogPath) && !fs.statSync(absBlogPath).isDirectory()){
			return response.sendFile(absBlogPath);

		} else {
			return next();
		}
	}

	server.get('/asset/*', serveAsset);
	server.get('/*', serveMedia);
	server.get('/*', serveArticles);
	server.get('/*', serveArticle);

	server.listen(Writenode.getService('conf').port);

	return Bluebird.resolve(server);
}
