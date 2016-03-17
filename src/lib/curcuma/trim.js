import defaultToWhiteSpace from './defaultToWhiteSpace';
import { curry } from 'ramda';

function trim(characters, str){
	if (!characters) {
		return str.trim();
	}

	characters = defaultToWhiteSpace(characters);

	return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
}


var curried = curry(trim);

export default curried;
