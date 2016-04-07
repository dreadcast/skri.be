import { join } from 'path';
import { map, pick, filter, contains } from 'ramda';
import { THEME_CONF, CONF, PATH_TO_THEME } from './../../conf';
import logger from './../../util/logger';
import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';

var nunjucksEnv = nunjucks.configure(PATH_TO_THEME, {
	noCache: true,
	watch: true,
});
nunjucksEnv.addFilter('date', nunjucksDate);

var {
	json: jsonTemplate,
	html: htmlTemplate,
} = THEME_CONF.defaultTemplates.articleCollection;

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

export default function serveTag(articles, tag, response, type){
	articles = filter(({ tags }) => contains(tag, tags), articles);

	switch (type) {
		case 'json':
			return response.json(getTagged(articles, tag, jsonTemplate));
			break;

		default:
			let pathToTpl = join('asset', htmlTemplate);

			let result = nunjucksEnv.render(pathToTpl, {
				articles,
				tag,
				PATH_TO_THEME,
			});

			return response.end(result);
			break;
	}
}
