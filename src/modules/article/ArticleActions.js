import { merge, mapObjIndexed, keys, contains } from 'ramda';
import Bluebird from 'bluebird';

import { fetchArticle } from './ArticleClient.js';
import { addTags } from './../tag/TagActions.js';
import { UPDATE_MEDIA, getMediaInfo } from './../media/MediaActions.js';
import logger from './../../util/logger.js';
import getById from './../../lib/careme/getById.js';
import { writeCacheArticle } from './../../util/cache';

export const REPORT_COLLISION = 'REPORT_COLLISION';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const SET_ARTICLE_TEMPLATES = 'SET_ARTICLE_TEMPLATES';

function updateArticle(article){
	return function(dispatch, getState){
		dispatch(addTags(article.tags));

		dispatch({
			type: UPDATE_ARTICLE,
			articleId: article.id,
			article,
		});
	}
}

function updateMedias(article){
	return function(dispatch, getState){
		let { id, medias } = article;

		return Bluebird.map(medias, media => {
				return dispatch(getMediaInfo(media, id));
			})
			.then(medias => article);
	}
}

function setArticleTemplates(article){
	return function(dispatch, getState){
		let { templates, id } = article;

		dispatch({
			type: SET_ARTICLE_TEMPLATES,
			articleId: id,
			templates,
		});

		return article;
	}
}
/*
find . -name "*.sum" -type f -delete && find . -name "*.jsoncache" -type f -delete
*/

export function getArticle(path){
	return function(dispatch, getState){
		return fetchArticle(path)
			.then(article => {
				dispatch(updateArticle(article))

				if(article.fromCache) {
					return article;

				} else {
					dispatch(setArticleTemplates(article))

					return dispatch(updateMedias(article))
						.then(article => {
							article = getById(
								article.id,
								getState().articles
							);

							return writeCacheArticle(article);
						})
						.then(result => article);
				}
			});
	}
}
