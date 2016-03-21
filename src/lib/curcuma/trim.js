import defaultToWhiteSpace from './defaultToWhiteSpace';
import { curry } from 'ramda';

function trim(characters, str){
	if (!characters) {
		return str.trim();
	}

	characters = defaultToWhiteSpace(characters);

	return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
}

export default curry(trim);
