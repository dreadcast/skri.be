import { join } from 'path';
import buildArticles from './article';
import buildArticleCollections from './articleCollection';
import logger from './../../util/logger';
import express from 'express';
import open from 'open';
import { pathToBlog, testPort } from './../../conf';

function testServe() {
	const app = express();

	app.use(
		express.static(join(pathToBlog, 'build'))
	);

	app.listen(testPort);

	logger.info('Testing build on port ', testPort);

	open('http://localhost:' + testPort);
}

export default function build(state) {
	return buildArticles(state.articles)
		.then(result => buildArticleCollections(state))
		.then(testServe);
}
