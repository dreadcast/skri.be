import { join } from 'path';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import logger from './logger';
import CONF from './../conf';
import { exec } from 'child_process';

const outputJson = Bluebird.promisify(fs.outputJson);

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

	return outputJson(cachePath, article);
}

export function purgeCache() {
	return exec('find . -name "*.sum" -type f -delete && find . -name "*.jsoncache" -type f -delete');
}
