import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import express from 'express';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';

export default function(Writenode){
	let server = express(),
        articles = Writenode.getService('articles'),
        views = Writenode.getService('views');

    return new Bluebird((resolve, reject) => {
        server.get('/*', (req, res, next) => {
            let path = req.params[0],
                response = {};

            // console.info(path);
            // console.info(articles.tags);
            // console.info(articles.pluck('id'));

            if(articles.tags.indexOf(path) > -1){
                response.text = 'this is a tag';

                response.articles = views.renderJsonList(articles.toJSON().filter(article => Lowerdash.contains(article.tags, path)), articles.templates.posts);
            }

            if(articles.pluck('id').indexOf(path) > -1){
                response.text = 'this is an article';

                let article = articles.get(path);
                // console.info(article.get('templates').html)

                return views.render(article.get('templates').html, {
                    article: article.toJSON()
                })
                    .then(html => res.end(html));

                response.article = views.renderJson(article.toJSON(), article.get('templates'));
            }

            res.json(response);
        });

        server.listen(Writenode.getService('conf').port);

        return resolve(server);
    });
}
