import fs from 'fs-extra';
import Path from 'path';
import Bluebird from 'bluebird';
import logger from './../../util/logger';
import render from './../../view/article';
import CONF from './../../conf';

const outputJson = Bluebird.promisify(fs.outputJson);
const outputFile = Bluebird.promisify(fs.outputFile);

export default function buildArticles(articles) {
	return Bluebird.map(articles, buildArticle);
}

function buildArticle(article){
	logger.info('BUILD', article.title);

	var destPath = Path.join(CONF.pathToBlog, 'build', article.id);

	return outputJson(destPath + '.json', article)
		.then(result => outputFile(
			Path.join(destPath, 'index.html'),
			render(article, 'html')
		))
		.then(result => outputFile(
			Path.join(destPath, 'partial/index.html'),
			render(article, 'partial')
		));
}
