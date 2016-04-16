import { merge } from 'ramda';

import logger from './../../util/logger';
import CONF from './../../conf';
import { SET_ARTICLE_TEMPLATES } from './../article/ArticleActions.js';

export default function updateTemplates(){
	return CONF.theme.defaultTemplates;
}

export function updateArticleTemplates(state = CONF.theme.defaultTemplates.article, action) {
	state = merge(CONF.theme.defaultTemplates.article, state);

	switch (action.type) {
		case SET_ARTICLE_TEMPLATES:
			return merge(state, action.templates);

		default:
			return state;
	}
}
