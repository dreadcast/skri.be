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
	let { type, cleanPath } = parseUrl(request.url);

	if(request.url == '/') {
		return serveArticleCollection(state.articles, undefined, response, type);
	}

	if(type == 'media') {
		return response.sendFile(join(CONF.pathToBlog, 'data', request.url));
	}

	var matchTag = cleanPath.match(/^tag\/(.*)/);

	if(matchTag) {
		let tag = matchTag[1];

		if(contains(tag, state.tag)) {
			return serveArticleCollection(state.articles, tag, response, type)
		}
	}

	let article = getById(cleanPath, state.articles);

	if(article) {
		return serveArticle(article, response, type);
	}
}
