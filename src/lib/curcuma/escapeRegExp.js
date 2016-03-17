import { curry } from 'ramda';

function escapeRegExp(needle, str){
	return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

var curried = curry(escapeRegExp);

export default curried;
