import { join } from 'path';
import { contains } from 'ramda';
import fs from 'fs';
import Bluebird from 'bluebird';
import { PATH_TO_BLOG, PATH_TO_THEME } from './../../conf';
import store, { dispatch } from './../../modules/store';
import getById from './../../lib/careme/getById';
import logger from './../../util/logger';
import serveTag from './tag';
import serveArticle from './article';

function parsePath(url) {
	var type = 'html',
		cleanPath = url.replace(/\.html$/, '');

	if(/\.json$/.test(url)) {
		type = 'json';
		cleanPath = url.replace(/\.json$/, '');

	} else if(/\/(partial)(\.html)?$/.test(url)) {
		type = 'partial';
		cleanPath = url.replace(/\/(partial)(\.html)?$/, '');

	} else if(/\.([a-z0-9]+)$/i.test(url)) {
		type = 'media';
		cleanPath = url;
	}

	cleanPath = cleanPath.replace(/^\//, '');

	return {
		type,
		cleanPath,
	};
}

export default function serveData(request, response, next){
	let { type, cleanPath } = parsePath(request.url);

	if(type == 'media') {
		return response.sendFile(join(PATH_TO_BLOG, 'data', request.url));
	}

	let state = store.getState();

	if(contains(cleanPath, state.tag)) {
		return serveTag(state.articles, cleanPath, response, type)
	}

	let article = getById(cleanPath, state.articles);

	if(article) {
		return serveArticle(article, response, type);
	}
}