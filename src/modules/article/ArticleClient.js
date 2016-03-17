import Bluebird from 'bluebird';
import fs from 'fs';
import logger from './../../util/logger';

const readFile = Bluebird.promisify(fs.readFile);

import parseMarkdown from './../../lib/markdown-parser.js';

export function fetchArticle(path){
	return readFile(path, {
		encoding: 'utf8'
	})
		.catch(error => logger.error('Error reading file ' + path, error))
		.then(data => parseMarkdown(data, path))
		.catch(error => logger.error('Error parsing markdown file ' + path, error));
}
