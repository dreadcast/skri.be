import watch from './watcher';
import server from './server';
import logger from './util/logger';
import CONF from './conf';

import _build from './build/data';

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
		onComplete: _build
	});
}
