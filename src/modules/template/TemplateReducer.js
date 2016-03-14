import { merge } from 'ramda';

import logger from './../../util/logger';
import { THEME_CONF } from './../../conf';
import { SET_ARTICLE_TEMPLATES } from './../article/ArticleActions.js';

export default function updateTemplates(){
	return THEME_CONF.defaultTemplates;
}

export function updateArticleTemplates(state = THEME_CONF.defaultTemplates.article, action) {
	state = merge(THEME_CONF.defaultTemplates.article, state);

	switch (action.type) {
		case SET_ARTICLE_TEMPLATES:
			return merge(state, action.templates);

		default:
			return state;
	}
}
