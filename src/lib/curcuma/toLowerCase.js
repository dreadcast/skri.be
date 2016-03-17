import { curry } from 'ramda';

function toLowerCase(str){
	return str.toLowerCase();
}

var curried = curry(toLowerCase);

export default curried;
