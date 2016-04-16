import { join } from 'path';
import { contains } from 'ramda';
import fs from 'fs';
import Bluebird from 'bluebird';
import CONF from './../../conf';
import store, { dispatch } from './../../modules/store';
import getById from './../../lib/careme/getById';
import logger from './../../util/logger';
import { parseUrl } from './../../util/urlParser';
import serveArticleCollection from './articleCollection';
import serveArticle from './article';
import serveHome from './home';

export default function serveData(request, response, next){
	let state = store.getState();

	if(request.url == '/') {
		return serveArticleCollection(state.articles, undefined, response, type);
	}

	let { type, cleanPath } = parseUrl(request.url);

	if(type == 'media') {
		return response.sendFile(join(CONF.pathToBlog, 'data', request.url));
	}

	if(contains(cleanPath, state.tag)) {
		return serveArticleCollection(state.articles, cleanPath, response, type)
	}

	let article = getById(cleanPath, state.articles);

	if(article) {
		return serveArticle(article, response, type);
	}
}
