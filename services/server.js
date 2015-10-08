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
        { pathToTheme } = Writenode.getService('conf');


    return new Bluebird((resolve, reject) => {
        server.get('/asset/*', (request, response, next) => {
			assets.process(Path.join(pathToTheme, request.params[0]))
				.then(processed => response.end(processed));
		});

        server.get('/*', (request, response, next) => {
			let ext = Path.extname(request.params),
				params = {
					path: request.params[0].replace(ext, ''),
					type: ext.replace('.', '') || 'html'
				},
                responseData = {};

            if(articles.tags.indexOf(params.path) > -1){
                responseData.articles = views.renderJsonList(articles.toJSON().filter(article => Lowerdash.contains(article.tags, params.path)), articles.defaultTemplates.posts[params.type]);
            }

            if(articles.pluck('id').indexOf(params.path) > -1){
                let article = articles.get(params.path);

                return views.render(article.get('templates')[params.type], {
                    article: article.toJSON()
                })
                    .then(html => response.end(html));

                responseData.article = views.renderJson(article.toJSON(), article.get('templates'));
            }

            response.json(responseData);
        });

        server.listen(Writenode.getService('conf').port);

        return resolve(server);
    });
}
