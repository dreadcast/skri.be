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

			return Bluebird.each(queue.filter(matcher), filePath => changeHandler(filePath))
				.then(queued => changeHandlers.set(matchers, changeHandler));
		}

		let watcher = chokidar.watch([
			pathToTheme,
			pathToBlog + '/data/**/*',
		], {
			ignored: '.git/**'
		})
			.on('add', filePath => queue.push(filePath))
			.on('change', path => {
				// console.info('WATCHER CHANGE: ', path);

				changeHandlers.forEach((changeHandler, matchers) => {
					if(anymatch(matchers, path)){
						changeHandler(path);
					};
				});

			})
			.on('ready', () => {
				return resolve({
					addChangeHandler,
					watcher,
					queue,
				});
			});
	});
}
