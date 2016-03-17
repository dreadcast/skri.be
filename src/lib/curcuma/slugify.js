import { curry, pipe } from 'ramda';
import dasherize from './dasherize';
import toLowerCase from './toLowerCase';
import replace from './replace';
import defaultToWhiteSpace from './defaultToWhiteSpace';

function slugify(str){
	var from = 'ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź',
		to = 'aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz',
		regex = new RegExp(defaultToWhiteSpace(from), 'g');

	return pipe(
		toLowerCase(),
		replace(regex, c => to.charAt(from.indexOf(c)) || '-'),
		replace(/[^\w\s-]/g, ''),
		dasherize(),
	)(str);
}

var curried = curry(slugify);

export default curried;
