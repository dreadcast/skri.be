import { curry } from 'ramda';

function split(needle, str){
	return str.split(needle);
}

var curried = curry(split);

export default curried;
