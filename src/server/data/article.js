import { join } from 'path';
import nunjucks from 'nunjucks';

import logger from './../../util/logger';
import { PATH_TO_THEME } from './../../conf';

nunjucks.configure(PATH_TO_THEME, {
	noCache: true,
	watch: true,
});

export default function serveArticle(article, response, type){
	if(type == 'json') {
		return response.json(article);

	} else if(type == 'html' || type == 'partial') {
		let pathToTpl = join(PATH_TO_THEME, 'asset', article.templates[type]);

		let result = nunjucks.render(pathToTpl, {
			article,
			PATH_TO_THEME,
		});

		return response.end(result);
	}
}
