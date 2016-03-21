import { curry } from 'ramda';

function substr(start, length, str){
	return str.substr(start, length);
}

export default curry(substr);
