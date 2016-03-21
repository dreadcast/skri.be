import { curry } from 'ramda';

function toLowerCase(str){
	return str.toLowerCase();
}

export default curry(toLowerCase);
