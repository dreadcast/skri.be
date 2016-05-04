import { filter, contains } from 'ramda';
import logger from './../../util/logger';
import render, { getTagged } from './../../view/articleCollection';

export default function serveArticleCollection(articles, tag, response, type){
	var taggedArticles = getTagged(articles);

	switch (type) {
		case 'json':
			return response.json(taggedArticles);
			break;

		default:
			return response.end(render(taggedArticles));
			break;
	}
}
