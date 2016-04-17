import { filter, contains } from 'ramda';
import logger from './../../util/logger';
import render, { getTagged } from './../../view/articleCollection';

export default function serveArticleCollection(articles, tag, response, type){
	if(tag != undefined) {
		articles = filter(({ tags }) => contains(tag, tags), articles);
	}

	switch (type) {
		case 'json':
			return response.json(getTagged(articles, tag));
			break;

		default:
			return response.end(render(articles, tag));
			break;
	}
}
