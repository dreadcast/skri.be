import { assoc, dissoc  } from 'ramda';

import {  REMOVE_ARTICLE } from './ArticlesActions.js';

import {
	SET_ARTICLE_TEMPLATES,
	UPDATE_ARTICLE,
	UPDATE_ARTICLE_MEDIAS,
} from './ArticleActions.js';

import updateArticle from './ArticleReducer.js';

var defaultArticles = {};

function updateArticles(state = defaultArticles, action) {
	switch (action.type) {
		case REMOVE_ARTICLE:
			return dissoc(action.id, state);

		case UPDATE_ARTICLE:
		case SET_ARTICLE_TEMPLATES:
		case UPDATE_ARTICLE_MEDIAS:
			return assoc(action.article.id, updateArticle(state[action.id], action), state);

		default:
			return state;
	}
}


var defaultState = {};

export default function articles(state = defaultState, action) {
	switch (action.type) {
		case REMOVE_ARTICLE:
			return dissoc(action.id, state);

		case UPDATE_ARTICLE:
		case SET_ARTICLE_TEMPLATES:
			return assoc(action.id, action.article, state);

		default:
			return state;
	}
}
