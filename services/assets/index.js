import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import less from './less';
import es from './es';

// import babel from 'babel';
var babel = require('babel');

export default function(Writenode){
	return Writenode.addService('less', less)
	    .then(() => Writenode.addService('es', es))
		.then(() => {
			let readFile = Bluebird.promisify(fs.readFile);

		    function process(path){
		        switch(Path.extname(path)){
		            case '.es':
		            case '.es6':
		            case '.es7':
		            case '.jsx':
		                return Writenode.getService('es').process(path);
		                break;

		            case '.css':
		            case '.less':
						return Writenode.getService('less').process(path);
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
