import swig from 'swig';
import Bluebird from 'bluebird';

export function precompile(pathToTemplate){
	var render = swig.compileFile(pathToTemplate, {
		filename: pathToTemplate
	});

	return Bluebird.resolve(render);
}
