import trim from './trim';
import { curry } from 'ramda';

function clean(str){
	return trim(undefined, str).replace(/\s+/g, ' ');
}
var curried = curry(clean);

export default curried;
