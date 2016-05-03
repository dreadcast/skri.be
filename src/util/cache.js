import { join } from 'path';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import logger from './logger';
import CONF from './../conf';

const writeJson = Bluebird.promisify(fs.writeJson);

export function cacheArticles(articles) {
	return articles
		.filter(article => !article.fromCache)
		.map(writeCacheArticle);
}

export function writeCacheArticle(article) {
	var cachePath = join(
		CONF.pathToBlog,
		'data',
		article.url,
		'/.jsoncache'
	);

	logger.info('WRITING DATA CACHE', cachePath);

	return writeJson(cachePath, article);
}
