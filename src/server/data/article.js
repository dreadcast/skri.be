import { join } from 'path';
import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';
import logger from './../../util/logger';
import { assoc, mapObjIndexed } from 'ramda';

import CONF from './../../conf';

var nunjucksEnv = nunjucks.configure(CONF.pathToTheme, {
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
					.replace(CONF.themeTemplatePrefix, '')
					// .replace(CONF.blogTemplatePrefix, CONF.pathToBlog + '/')
			}

			return template;
		}, article.templates);

		article = assoc('templates', templates, article);

		let result = nunjucksEnv.render(article.templates[type], {
			article,
			CONF,
		});

		return response.end(result);
	}
}
