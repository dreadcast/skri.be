import { fetchArticle } from './ArticleClient.js';
import { addTags } from './../tag/TagActions.js';

export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const SET_ARTICLE_TEMPLATES = 'SET_ARTICLE_TEMPLATES';
export const UPDATE_ARTICLE_MEDIAS = 'UPDATE_ARTICLE_MEDIAS';

export function updateArticle(article){
	return function(dispatch, getState){
		dispatch(addTags(article.tags));

		dispatch({
			type: UPDATE_ARTICLE,
			id: article.id,
			article,
		});

		// console.info(article);
		return article;
	}
}

export function getArticle(path){
	return function(dispatch, getState){
		return fetchArticle(path)
			.then(article => dispatch(updateArticle(article)));
	}
}


export function setArticleTemplates(article){
	return function(dispatch, getState){
		let templates = getState().articles.toJS().defaultTemplates.article;

		if(article.templates){
			// let articleTemplates = articles.setTemplatesPath(attributes.templates, pathToTheme);

			// Lowerdash.assign(article.templates, templates);
		}

		return dispatch({
			type: SET_ARTICLE_TEMPLATES,
			id: article.id,
			templates,
		});
	}
}
