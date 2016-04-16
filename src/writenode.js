import watch from './watcher';
import server from './server';
import logger from './util/logger';
import CONF from './conf';

var watcher = watch({
	onReady(){
		logger.info('WATCHER READY');
	},

	onQueue(path){
		// path = path.replace(CONF.pathToBlog, '').replace(CONF.pathToTheme, '');

		// logger.info(`QUEUE: ${path}`);
	},

	onPop(path, result, type){
		// path = path.replace(CONF.pathToBlog, '').replace(CONF.pathToTheme, '');

		// logger.info(`POP ${type}: ${path}`);
	},

	onComplete(state){
		logger.log(state);
	}
});

export var dev = server.start;

export function build(){

}
