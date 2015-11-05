import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import chokidar from 'chokidar';
import anymatch from 'anymatch';

export default function(Writenode){
	return new Bluebird((resolve, reject) => {
		let queue = [],
			changeHandlers = new Map,
			{ pathToBlog, pathToTheme } = Writenode.getService('conf');

		// Add change handler
		// Returns a promise that resolves when all matching queued paths where first handled
		function addChangeHandler(matchers, changeHandler){
			var matcher = anymatch(matchers);

			return Bluebird.each(queue.filter(matcher), filePath => {
				queue.splice(queue.indexOf(filePath), 1);

				return changeHandler(filePath);
			})
				.then(queued => changeHandlers.set(matchers, changeHandler));
		}

		function execChangeHandlers(path){
			changeHandlers.forEach((changeHandler, matchers) => {
				if(anymatch(matchers, path)){
					// console.info('WATCHER MATCHED: ', path);
					changeHandler(path);
				};
			});
		}

		let watcher = chokidar.watch([
			pathToTheme,
			pathToBlog + '/data/**/*',
		], {
			ignored: /\/\.([a-z|0-9|_|-]+)/i
		})
			.on('add', filePath => {
				// console.info('ADD FILE ', filePath);

				if(Writenode.isReady()){
					execChangeHandlers(filePath);

				} else {
					queue.push(filePath)
				}
			})
			.on('change', path => {
				// console.info('WATCHER CHANGE: ', path);

				execChangeHandlers(path);
			})
			// .on('ready', () => {
				return resolve({
					addChangeHandler,
					watcher,
					queue,
				});
			// });
	});
}
