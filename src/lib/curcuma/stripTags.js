import { curry } from 'ramda';

function stripTags(str){
	return str.replace(/<\/?[^>]+>/g, '');
}

export default curry(stripTags);
