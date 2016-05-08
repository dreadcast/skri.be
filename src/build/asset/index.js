import { join, relative } from 'path';
import recurse from 'fs-recurse';
import fs from 'fs-extra';
import processLess from './../../asset/less';
import Bluebird from 'bluebird';
import logger from './../../util/logger';
import { pathToTheme, pathToBlog } from './../../conf';

function process(path, file, type, cursor) {
	var relativePath = relative(pathToTheme, path);
	var pathToFile = join(relativePath, file);
	var from = join(path, file);
	var to = join(pathToBlog, 'build', pathToFile);

	switch (type) {
		case 'folder':
			setTimeout(cursor, 1);
			break;

		case 'less':
			logger.info('LESS file found, process!');
			processLess(from)
				.then(css => {
					if(css) {
						to = to.replace(/\.less$/, '.css');

						return fs.outputFile(to, css);
					}

					return false;
				})
				.then(cursor);

			break;

		default:
			logger.log(`Copy from ${from} to ${to}`);

			fs.copy(from, to, error => {
				if(error) {
					throw error;
				}

				cursor();
			});
	}
}

export default function buildAsset() {
	logger.info('Build assets');

	return new Bluebird(function(resolve, reject) {
		recurse(
			pathToTheme,
			process,
			resolve,
			[/^\./, /\.nunjucks$/, /^package\.json/]
		);
	});
}
