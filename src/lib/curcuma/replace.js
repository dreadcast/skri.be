import { curry } from 'ramda';

function replace(search, replacement, str){
	return str.replace(search, replacement);
}

var curried = curry(replace);

export default curried;
