import { join } from 'path';
import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';

import logger from './../../util/logger';
import { PATH_TO_THEME } from './../../conf';

var nunjucksEnv = nunjucks.configure(PATH_TO_THEME, {
	noCache: true,
	watch: true,
});
nunjucksEnv.addFilter('date', nunjucksDate);

export default function serveArticle(article, response, type){
	if(type == 'json') {
		return response.json(article);

	} else if(type == 'html' || type == 'partial') {
		let pathToTpl = join('asset', article.templates[type]);

		let result = nunjucksEnv.render(pathToTpl, {
			article,
			PATH_TO_THEME,
		});

		return response.end(result);
	}
}
