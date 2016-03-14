import removeById from './../../lib/careme/removeById';
import getById from './../../lib/careme/getById';
import setById from './../../lib/careme/setById';
import { REMOVE_ARTICLE } from './ArticlesActions';
import { UPDATE_MEDIA } from './../media/MediaActions';
import { SET_ARTICLE_TEMPLATES, UPDATE_ARTICLE } from './ArticleActions';
import article from './ArticleReducer';

export default function articles(state = [], action) {
	switch (action.type) {
		case REMOVE_ARTICLE:
			return removeById(action.articleId, state);

		case UPDATE_MEDIA:
		case UPDATE_ARTICLE:
		case SET_ARTICLE_TEMPLATES:
			let previousArticle = getById(action.articleId, state);

			return setById(action.articleId, article(previousArticle, action), state);

		default:
			return state;
	}
}
