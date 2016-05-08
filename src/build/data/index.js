import { join } from 'path';
import buildArticles from './article';
import buildArticleCollections from './articleCollection';
import logger from './../../util/logger';



export default function buildData(state) {
	return buildArticles(state.articles)
		.then(result => buildArticleCollections(state));
}
