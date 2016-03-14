import watch from './watcher';
import server from './server';
import logger from './util/logger';
import { PATH_TO_BLOG, PATH_TO_THEME } from './conf';

var watcher = watch({
	onReady(){
		logger.info('WATCHER READY');
	},

	onQueue(path){
		// path = path.replace(PATH_TO_BLOG, '').replace(PATH_TO_THEME, '');

		// logger.info(`QUEUE: ${path}`);
	},

	onPop(path, result, type){
		// path = path.replace(PATH_TO_BLOG, '').replace(PATH_TO_THEME, '');

		// logger.info(`POP ${type}: ${path}`);
	},

	onComplete(state){
		logger.log(state);
	}
});

export var dev = server.start;

export function build(){

}
