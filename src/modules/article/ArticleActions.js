import { join, relative } from 'path';
import { merge, mapObjIndexed, keys } from 'ramda';
import Bluebird from 'bluebird';
import fs from 'fs-extra';

import { fetchArticle } from './ArticleClient.js';
import { addTags } from './../tag/TagActions.js';
import { UPDATE_MEDIA, getMediaInfo } from './../media/MediaActions.js';
import logger from './../../util/logger.js';
import { PATH_TO_THEME, PATH_TO_BLOG } from './../../conf.js';
import getById from './../../lib/careme/getById.js';

const writeJson = Bluebird.promisify(fs.writeJson);

export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';
export const SET_ARTICLE_TEMPLATES = 'SET_ARTICLE_TEMPLATES';

function updateArticle(article){
	return function(dispatch, getState){
		let { tags, id } = article;

		dispatch(addTags(tags));

		dispatch({
			type: UPDATE_ARTICLE,
			articleId: id,
			article,
		});

		return article;
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

function writeCacheArticle(article, path) {
	var cachePath = path.replace(/data\.md$/, '.jsoncache');

	logger.info('WRITING DATA CACHE', cachePath);

	return writeJson(cachePath, article)
		.then(result => article)
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
// find . -name "*.sum" -type f  -delete

export function getArticle(path){
	return function(dispatch, getState){
		return fetchArticle(path)
			.then(article => {
				return new Bluebird(resolve => {
					dispatch(updateArticle(article));

					if(article.fromCache) {
						resolve(article);

					} else {
						dispatch(setArticleTemplates(article))
						dispatch(updateMedias(article))
							.then(article => {
								let articles = getState().articles;

								article = getById(article.id, articles);

								return writeCacheArticle(article, path)
									.then(result => resolve(article));
							});
					}
				});
			});
	}
}
