import { resolve, join } from 'path';
import { mapObjIndexed } from 'ramda';


export const PATH_TO_BLOG = resolve('.');
export const CONF = require(join(PATH_TO_BLOG, 'package.json')).config;

var pathToTheme;

if(CONF.theme.path) {
	pathToTheme = resolve(CONF.theme.path);

} else if(CONF.path.name) {
	pathToTheme = resolve(join(PATH_TO_BLOG, 'node_modules', CONF.theme.name));
}

export const PATH_TO_THEME = pathToTheme;

export const THEME_CONF = require(join(PATH_TO_THEME, 'package.json')).config;

export const THEME_TEMPLATE_PREFIX = '%THEME%';
export const BLOG_TEMPLATE_PREFIX = '%BLOG%';

THEME_CONF.defaultTemplates.article = mapObjIndexed(template => {
	if(typeof template == 'string'){
		template = THEME_TEMPLATE_PREFIX + template;
	}

	return template;
}, THEME_CONF.defaultTemplates.article);
