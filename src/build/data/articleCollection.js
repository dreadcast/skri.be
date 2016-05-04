import fs from 'fs-extra';
import Path from 'path';
import HtmlMinifier from 'html-minifier';
import Bluebird from 'bluebird';
import logger from './../../util/logger';
import render, { getTagged } from './../../view/articleCollection';
import CONF from './../../conf';

const outputJson = Bluebird.promisify(fs.outputJson);
const outputFile = Bluebird.promisify(fs.outputFile);

export default function buildArticleCollections(state) {
	return Bluebird.map(state.tag, tag => {
		return buildArticleCollection(tag, state.articles);
	});
}

function buildArticleCollection(tag, articles){
	logger.info('BUILD TAG', tag);

	var destPath = Path.join(CONF.pathToBlog, 'build/tag', tag);
	var taggedArticles = getTagged(articles, tag);

	return outputJson(destPath + '.json', taggedArticles)
		.then(result => outputFile(
			Path.join(destPath, 'index.html'),
			HtmlMinifier.minify(render(taggedArticles, 'html'), {

			})
		));
}
