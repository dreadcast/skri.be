import { join } from 'path';
import { contains } from 'ramda';
import fs from 'fs';
import Bluebird from 'bluebird';
import { PATH_TO_BLOG, PATH_TO_THEME } from './../../conf';
import store, { dispatch } from './../../modules/store';
import getById from './../../lib/careme/getById';
import logger from './../../util/logger';
import { parseUrl } from './../../util/urlParser';
import serveTag from './tag';
import serveArticle from './article';
import serveHome from './home';

export default function serveData(request, response, next){
	if(request.url == '/') {
		return response.end(serveHome());
	}

	let { type, cleanPath } = parseUrl(request.url);

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
