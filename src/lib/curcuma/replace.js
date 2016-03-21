import { curry } from 'ramda';

function replace(search, replacement, str){
	return str.replace(search, replacement);
}

export default curry(replace);
