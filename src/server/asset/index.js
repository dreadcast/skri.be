import CONF from './../../conf';
import { join, resolve, extname } from 'path';
import fs from 'fs';
import Bluebird from 'bluebird';
import logger from './../../util/logger';

const readFile = Bluebird.promisify(fs.readFile);

export default function serveAsset(request, response, next) {
	let path = join(CONF.pathToTheme, request.url);

	switch (extname(request.url)) {
		case '.jpg':
		case '.png':
		case '.webp':
		case '.gif':
		case '.svg':
		case '.css':
		case '.js':
			response.sendFile(path);
			break;

		case '.less':
		case '.es':
		case '.es6':
		default:
			readFile(path, 'utf8')
				.then(data => response.end(data))
				.catch(error => logger.error(`Error reading ${path}`));
	}
}
