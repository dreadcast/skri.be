import { map, pick } from 'ramda';
import logger from './../util/logger';
import CONF from './../conf';
import nunjucksEnv from './engines/nunjucks';

var {
	json: jsonTemplate,
	html: htmlTemplate,
} = CONF.theme.defaultTemplates.articleCollection;

export function getTagged(articles, tag){
	return {
		pager: {
			count: articles.length,
			totalPages: Math.ceil(articles.length / CONF.theme.perPage),
		},
		articles: map(article => pick(jsonTemplate, article), articles),
		tag,
	}
}

export default function render(articles, tag){
	return nunjucksEnv.render(htmlTemplate, {
		articles,
		tag,
		CONF,
	});
}
