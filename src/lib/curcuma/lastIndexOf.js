import { curry } from 'ramda';

function lastIndexOf(needle, str){
	return str.lastIndexOf(needle);
}

export default curry(lastIndexOf);
