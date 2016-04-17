import { resolve, join } from 'path';
import { mapObjIndexed, assocPath, assoc } from 'ramda';
import merge from 'lodash/merge';
import logger from './util/logger';

var themeTemplatePrefix = '%THEME%';
var blogTemplatePrefix = '%BLOG%';

var pathToTheme,
	pathToBlog = resolve('.'),
	blogConf = require(join(pathToBlog, 'package.json')).config;


if(blogConf.theme.path) {
	pathToTheme = resolve(blogConf.theme.path);

} else if(blogConf.path.name) {
	pathToTheme = resolve(join(pathToBlog, 'node_modules', blogConf.theme.name));
}

var themeConf = require(join(pathToTheme, 'package.json')).config;

blogConf = merge({
	themeTemplatePrefix,
	blogTemplatePrefix,
	pathToBlog,
	pathToTheme,
	theme: themeConf,
}, blogConf);

const CONF = assocPath(
	['theme', 'defaultTemplates', 'article'],
	prefixTemplates(blogConf.theme.defaultTemplates.article),
	blogConf
);

export default CONF;

function prefixTemplates(templates){
	return mapObjIndexed(template => {
		if(typeof template == 'string'){
			template = themeTemplatePrefix + template;
		}

		return template;
	}, templates);
}
