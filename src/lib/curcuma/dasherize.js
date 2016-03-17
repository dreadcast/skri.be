import { curry, pipe } from 'ramda';
import trim from './trim';
import toLowerCase from './toLowerCase';
import replace from './replace';

function dasherize(str){
	return pipe(
		trim(undefined),
		replace(/([A-Z])/g, '-$1'),
		replace(/[-_\s]+/g, '-'),
		toLowerCase(),
	)(str);
}

var curried = curry(dasherize);

export default curried;
