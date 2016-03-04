import nunjucks from 'nunjucks';
import fs from 'fs';
import Bluebird from 'bluebird';

var readFile = Bluebird.promisify(fs.readFile);

export function precompile(pathToTemplate){
	return readFile(pathToTemplate, {
			encoding: 'utf-8'
		})
		.then(templateContent => {
			return nunjucks.compile(templateContent, null, pathToTemplate).render;
		});
}
