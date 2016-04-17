import { assoc, mapObjIndexed } from 'ramda';
import logger from './../util/logger';
import CONF from './../conf';
import nunjucksEnv from './engines/nunjucks';

export default function render(article, type){
	let templates = mapObjIndexed(template => {
		if(typeof template == 'string'){
			template = template
				.replace(CONF.themeTemplatePrefix, '')
				// .replace(CONF.blogTemplatePrefix, CONF.pathToBlog + '/')
		}

		return template;
	}, article.templates);

	article = assoc('templates', templates, article);

	return nunjucksEnv.render(article.templates[type], {
		article,
		CONF,
	});
}
