import fs from 'fs-extra';
import { join, relative } from 'path';
import HtmlMinifier from 'html-minifier';
import Bluebird from 'bluebird';
import logger from './../../util/logger';
import render from './../../view/article';
import { pathToBlog } from './../../conf';
import recurse from 'fs-recurse';

const outputJson = Bluebird.promisify(fs.outputJson);
const outputFile = Bluebird.promisify(fs.outputFile);

export default function buildArticles(articles) {
	return Bluebird.map(articles, buildArticle, {
		concurrency: 1
	});
}

function buildArticle(article){
	logger.info('BUILD ARTICLE', article.title);

	var destPath = join(pathToBlog, 'build', article.id);

	return outputJson(destPath + '.json', article)
		.then(result => outputFile(
			join(destPath, 'index.html'),
			HtmlMinifier.minify(render(article, 'html'), {
				collapseWhitespace: true
			})
		))
		.then(result => outputFile(
			join(destPath, 'partial/index.html'),
			HtmlMinifier.minify(render(article, 'partial'), {
				collapseWhitespace: true
			})
		))
		.then(result => copyMedia(article));
}

function copyMedia(article) {
	return new Bluebird(function(resolve, reject){
		recurse(
			join(pathToBlog, 'data', article.id),
			function(path, file, type, cursor) {
				if(type == 'folder') {
					return setTimeout(cursor, 1);
				}

				var destPath = join(pathToBlog, 'build', article.id);

				fs.copy(path, destPath, error => {
					if(error) {
						reject(error);
					}

					logger.info('COPIED MEDIA', join(destPath, file));

					cursor();
				});
			},
			resolve,
			[/data\.md/, /^\.jsoncache/, /^\.sum/]
		);
	});
}
