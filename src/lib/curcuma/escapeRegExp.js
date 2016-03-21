import { curry } from 'ramda';

function escapeRegExp(needle, str){
	return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

export default curry(escapeRegExp);
