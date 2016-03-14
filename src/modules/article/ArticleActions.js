import { join, relative } from 'path';
import { merge, mapObjIndexed, keys } from 'ramda';
import Bluebird from 'bluebird';

import { fetchArticle } from './ArticleClient.js';
import { addTags } from './../tag/TagActions.js';
import { UPDATE_MEDIA, getMediaInfo } from './../media/MediaActions.js';
import logger from './../../util/logger.js';
import { PATH_TO_THEME, PATH_TO_BLOG } from './../../conf.js';
import getById from './../../lib/careme/getById.js';

export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const SET_ARTICLE_TEMPLATES = 'SET_ARTICLE_TEMPLATES';

function updateArticle(article){
	return function(dispatch, getState){
		let { tags, id, medias } = article;

		dispatch(addTags(tags));

		dispatch({
			type: UPDATE_ARTICLE,
			articleId: id,
			article,
		});

		return Bluebird.map(medias, media => dispatch(getMediaInfo(media, id)))
			.then(medias => article);
	}
}

export function getArticle(path){
	return function(dispatch, getState){
		return fetchArticle(path)
			.then(article => dispatch(updateArticle(article)))
			.then(article => dispatch(setArticleTemplates(article)));
	}
}

function setArticleTemplates(article){
	return function(dispatch, getState){
		let { templates, id } = article;

		// if(keys(templates).length > 0){
			templates = mapObjIndexed(template => {
				var path = join(PATH_TO_BLOG, 'data', id, template);

				return relative(PATH_TO_THEME, path);
			}, templates);

			dispatch({
				type: SET_ARTICLE_TEMPLATES,
				articleId: id,
				templates,
			});
		// }

		return article;
	}
}
