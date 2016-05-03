import { resolve } from 'path';
import { merge } from 'ramda';
import Bluebird from 'bluebird';
import chokidar from 'chokidar';
import store, { dispatch } from './modules/store';
import { getArticle } from './modules/article/ArticleActions';
// import { cacheArticles } from './util/cache';
import CONF from './conf';

export default function watch(options){
	options = merge({
		onReady(){},
		onQueue(path){},
		onPop(path, result, type){},
		onComplete(state){},
	}, options);

	let queue = [],
		isRunning = false,
		pathToThemeReg = new RegExp('^' + CONF.pathToTheme);

	function queueItem(path) {
		path = resolve(path);

		queue.push(path);
		options.onQueue(path);

		if(!isRunning) {
			runQueue()
		}
	}

	function handleNone(path){
		return function(dispatch){
			dispatch({
				type: 'NONE',
				path,
			});

			return Bluebird.delay(1)
		}
	}

	function execQueueItem(){
		var result,
			type,
			path = queue.shift();

		if(pathToThemeReg.test(path)) {
			type = 'ASSET';
			result = handleNone(path);

		} else if(/\.md$/.test(path)) {
			type = 'ARTICLE';
			result = getArticle(path);

		} else {
			type = 'NONE';
			result = handleNone(path);
		}

		options.onPop(path, result, type);

		return result;
	}

	function runQueue(){
		isRunning = true;

		return dispatch(execQueueItem())
			.then(article => {
				if(queue.length > 0) {
					return runQueue();
				}

				isRunning = false;

				var state = store.getState();

				options.onComplete(state);

				// cacheArticles(state.articles);

				return null;
			})
	}


	chokidar.watch([
		CONF.pathToBlog + '/data/**/*',
		CONF.pathToTheme + '/asset/**/*',
	], {
		ignored: /\/\.([a-z|0-9|_|-]+)/i
	})
		.on('add', queueItem)
		.on('change', queueItem)
		.on('ready', options.onReady);

	return {
		queue,

	}
}
