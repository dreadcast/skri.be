import logger from './../../util/logger';
import render from './../../view/article';

export default function serveArticle(article, response, type){
	if(type == 'json') {
		return response.json(article);

	} else if(type == 'html' || type == 'partial') {
		return response.end(render(article, type));
	}
}
