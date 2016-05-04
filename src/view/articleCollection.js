import { map, pick, filter, contains, assoc } from 'ramda';
import logger from './../util/logger';
import CONF from './../conf';
import nunjucksEnv from './engines/nunjucks';

var {
	json: jsonTemplate,
	html: htmlTemplate,
} = CONF.theme.defaultTemplates.articleCollection;

export function getTagged(articles, tag){
	if(tag) {
		articles = filter(({ tags }) => contains(tag, tags), articles);
	}

	return {
		pager: {
			count: articles.length,
			totalPages: Math.ceil(articles.length / CONF.theme.perPage),
		},
		articles: map(article => pick(jsonTemplate, article), articles),
		tag,
	}
}

export default function render(taggedArticles){
	return nunjucksEnv.render(
		htmlTemplate,
		assoc('CONF', CONF, taggedArticles)
	);
}
