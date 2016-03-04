import Path from 'path';
import Bluebird from 'bluebird';
import chokidar from 'chokidar';
import anymatch from 'anymatch';
import { getArticle } from './modules/article/ArticleActions.js';
import { dispatch, getState } from './modules/store.js';

export const pathToBlog = Path.resolve('.');

export function dev(pathToTheme){
	chokidar.watch([
		pathToBlog + '/data/**/*.md'
	], {
		ignored: /\/\.([a-z|0-9|_|-]+)/i
	})
		.on('add', article => dispatch(getArticle(article)))
		.on('change', article => dispatch(getArticle(article)))
		.on('ready', function(){
			setTimeout(e =>console.info(getState()), 800)
		});
}
