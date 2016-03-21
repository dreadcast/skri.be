import { curry } from 'ramda';

function substring(start, end, str){
	return str.substring(start, end);
}

export default curry(substring);
