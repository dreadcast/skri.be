import { join } from 'path';
import { map, pick, filter, contains } from 'ramda';
import CONF from './../../conf';
import logger from './../../util/logger';
import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';

var nunjucksEnv = nunjucks.configure(CONF.pathToTheme, {
	noCache: true,
	watch: true,
});
nunjucksEnv.addFilter('date', nunjucksDate);

var {
	json: jsonTemplate,
	html: htmlTemplate,
} = CONF.theme.defaultTemplates.articleCollection;

function getTagged(articles, tag, fields){
	return {
		pager: {
			count: articles.length,
			totalPages: Math.ceil(articles.length / CONF.theme.perPage),
		},
		articles: map(article => pick(fields, article), articles),
		tag,
	}
}

export default function serveArticleCollection(articles, tag, response, type){
	if(tag != undefined) {
		articles = filter(({ tags }) => contains(tag, tags), articles);
	}

	switch (type) {
		case 'json':
			return response.json(getTagged(articles, tag, jsonTemplate));
			break;

		default:
			let result = nunjucksEnv.render(htmlTemplate, {
				articles,
				tag,
				CONF,
			});

			return response.end(result);
			break;
	}
}
