import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import less from './less';
import es from './es';

// import babel from 'babel';
var babel = require('babel'),
	readFile = Bluebird.promisify(fs.readFile);

export default function(Writenode){
	let { addService, getService } = Writenode;

	return addService('assets/less', less)
	    .then(() => addService('assets/es', es))
		.then(() => {
		    function process(path){
		        switch(Path.extname(path)){
		            case '.es':
		            case '.es6':
		            case '.es7':
		            case '.jsx':
		                return getService('assets/es').process(path);
		                break;

		            case '.css':
		            case '.less':
						return getService('assets/less').process(path);
		                break;

		            default:
		                return readFile(path, {
		                    encoding: 'utf-8'
		                });
		                break;
		        }
		    }

			return {
				process
			};
	    });
}
