import fs from 'fs-extra';
import { assoc } from 'ramda';
import Bluebird from 'bluebird';
import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import less from 'less';
import logger from './../util/logger';
import { pathToTheme, pathToBlog } from './../conf';

const autoprefixPlugin = new LessPluginAutoPrefix({
	browsers: ['last 2 versions']
});
const LESS_OPTIONS = {
	plugins: [autoprefixPlugin],
	paths: [
		pathToTheme + '/less',
	],
	// compress: config.mode != 'dev'		  // Minify CSS output
};
const readFile = Bluebird.promisify(fs.readFile);

export function processFile(path) {
	return readFile(path, {
		encoding: 'utf-8'
	})
		.then(process);
}
export default function process(data, filename){
	return new Bluebird(function(resolve, reject){
		var lessOptions = LESS_OPTIONS;

		if(filename) {
			lessOptions = assoc('filename', filename, LESS_OPTIONS);
		}

		less.render(
			data,
			lessOptions,
			function(error, output) {
				if(error) {
					logger.error(error);
					reject(error);

				} else {
					resolve(output.css);
				}
			}
		);
	});
}
