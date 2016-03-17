import { curry } from 'ramda';

function stripTags(str){
	return str.replace(/<\/?[^>]+>/g, '');
}

var curried = curry(stripTags);

export default curried;
