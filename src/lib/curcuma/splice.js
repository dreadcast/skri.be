import { curry } from 'ramda';

function splice(i, howmany, substr, str){
	var arr = str.split('');

	arr.splice(~~i, ~~howmany, substr);

	return arr.join('');
}

var curried = curry(splice);

export default curried;
