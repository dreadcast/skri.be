import { curry } from 'ramda';

function split(needle, str){
	return str.split(needle);
}

export default curry(split);
