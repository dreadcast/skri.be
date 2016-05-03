import watch from './watcher';
import server from './server';
import logger from './util/logger';
import CONF from './conf';

import buildArticles from './build/data/article';

logger.info('Blog config', CONF)

export function dev() {
	watch({
		onReady(){
			logger.info('WATCHER READY');
		},

		onComplete(state){
			logger.info('WATCHER COMPLETE');
			// logger.log(state);
		}
	});

	server.start();
}

export function build(){
	watch({
		onComplete(state){
			buildArticles(state.articles);
		}
	});
}
