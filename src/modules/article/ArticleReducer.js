import { merge, assoc } from 'ramda';

import { updateArticleTemplates } from '../template/TemplateReducer.js';
import updateMedias from '../media/MediaCollectionReducer.js';
import logger from './../../util/logger';

import { SET_ARTICLE_TEMPLATES, UPDATE_ARTICLE } from './ArticleActions.js';
import { UPDATE_MEDIA } from '../media/MediaActions.js';
import CONF from './../../conf';

var defaultArticle = {
	id: '',
	url: '',
	title: '',
	content: '',
	templates: CONF.theme.defaultTemplates.article,
	medias: [],
};

export default function updateArticle(state = defaultArticle, action) {
	switch (action.type) {
		case UPDATE_MEDIA:
			return assoc('medias', updateMedias(state.medias, action), state);

		case UPDATE_ARTICLE:
			return merge(state, action.article);

		case SET_ARTICLE_TEMPLATES:
			return assoc(
				'templates',
				updateArticleTemplates(state.templates, action),
				state
			);

		default:
			return state;
	}
}
