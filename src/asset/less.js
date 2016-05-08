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
const lessOptions = {
	plugins: [autoprefixPlugin],
	paths: [
		pathToTheme + '/less',
	],
	// compress: config.mode != 'dev'		  // Minify CSS output
};
const readFile = Bluebird.promisify(fs.readFile);

export default function process(path){
	return readFile(path, {
		encoding: 'utf-8'
	})
		.then(data => {
			return new Bluebird(function(resolve, reject){
				less.render(
					data,
					assoc('filename', path, lessOptions),
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
		});
}
