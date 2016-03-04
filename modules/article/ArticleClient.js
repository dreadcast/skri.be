// import fsp from './../../lib/fs-promise.js';
import Bluebird from 'bluebird';
import fs from 'fs';

var readFile = Bluebird.promisify(fs.readFile);

import parseMarkdown from './../../lib/markdown-parser.js';

export function fetchArticle(path){
	return readFile(path, {
		encoding: 'utf8'
	})
	.catch(error => console.error('Error reading file ' + path, error))
		.then(data => parseMarkdown(data, path))
		.catch(error => console.error('Error parsing markdown file ' + path, error));
}
