import { curry } from 'ramda';

function splice(i, howmany, substr, str){
	var arr = str.split('');

	arr.splice(~~i, ~~howmany, substr);

	return arr.join('');
}

export default curry(splice);
