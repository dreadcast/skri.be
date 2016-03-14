import { map, pick, filter, contains } from 'ramda';
import { THEME_CONF, CONF } from './../../conf';
import logger from './../../util/logger';

function getTagged(articles, tag){
	let fields = THEME_CONF.defaultTemplates.articleCollection.json;

	return {
		pager: {
			count: articles.length,
			totalPages: Math.ceil(articles.length / CONF.theme.perPage),
		},
		articles: map(article => pick(fields, article), articles),
		tag,
	}
}

export default function serveTag(articles, tag, response, type){
	articles = filter(({ tags }) => contains(tag, tags), articles);

	switch (type) {
		case 'json':
			return response.json(getTagged(articles, tag, response));
			break;

		default:
			break;
	}
}
