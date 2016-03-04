import { merge } from 'ramda';

import {
	SET_ARTICLE_TEMPLATES,
	UPDATE_ARTICLE,
	UPDATE_ARTICLE_MEDIAS,
} from './ArticleActions.js';

var defaultArticle = {
	id: '',
	title: '',
	content: '',
	templates: {
		'rss': '',
		'ajax': '',
		'html': '',
		'json': '',
	}
};

export default function updateArticle(state = defaultArticle, action) {
	switch (action.type) {
		case UPDATE_ARTICLE:
			return merge(state, action.article);

		case SET_ARTICLE_TEMPLATES:
			let { templates } = action;

			return merge(state, {
				templates
			});

		default:
			return state;
	}
}
