import { join } from 'path';
import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';
import logger from './../../util/logger';
import { assoc, mapObjIndexed } from 'ramda';

import {
	PATH_TO_THEME,
	PATH_TO_BLOG,
	BLOG_TEMPLATE_PREFIX,
	THEME_TEMPLATE_PREFIX
} from './../../conf';

var nunjucksEnv = nunjucks.configure(PATH_TO_THEME, {
	noCache: true,
	watch: true,
});

nunjucksEnv.addFilter('date', nunjucksDate);

export default function serveArticle(article, response, type){
	if(type == 'json') {
		return response.json(article);

	} else if(type == 'html' || type == 'partial') {
		let templates = mapObjIndexed(template => {
			if(typeof template == 'string'){
				template = template
					.replace(THEME_TEMPLATE_PREFIX, '')
					// .replace(BLOG_TEMPLATE_PREFIX, PATH_TO_BLOG + '/')
			}

			return template;
		}, article.templates);

		article = assoc('templates', templates, article);

		let result = nunjucksEnv.render(article.templates[type], {
			article,
			PATH_TO_THEME,
		});

		return response.end(result);
	}
}
