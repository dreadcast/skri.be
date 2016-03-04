import { merge, assocPath, assoc, curry } from 'ramda';
import {
	SET_DEFAULT_TEMPLATES,
	PRECOMPILE_TEMPLATE,
	COMPILE_TEMPLATE,
} from './TemplateActions.js';

var templates = {
	defaultTemplates: {
		article: {
			rss: 'partial/rss.nunj',
			ajax: 'partial/article.nunj',
			html: 'tpl/article.nunj',
			json: [
				'title', 'id', 'content',
				'medias', 'created', 'status',
				'tags', 'summary'
			],
		},
		articles: {
			html: 'tpl/articles.nunj',
			json: ['title', 'id'],
		},
	},

	precompiled: {

	}
}

function mergeDefaultTemplates(templatesMap){
	return function(templates){
		assoc(
			'defaultTemplates',
			merge(templatesMap, templates.defaultTemplates),
			templates
		);
	}
}
function addTemplates(name, precompiled){
	return function(templates){
		assoc(
			'templates',
			assoc(name, precompiled, templates.precompiled),
			templates
		);
	}
}

export default function updateTemplates(state = templates, action){
	if(!action) {
		return state;
	}

	switch (action.type) {
		case SET_DEFAULT_TEMPLATES:
			return mergeDefaultTemplates(action.templates, state);

		case PRECOMPILE_TEMPLATE:
			return addTemplates(action.path, action.render, state);

		case COMPILE_TEMPLATE:
		default:
			return state;
	}
}
