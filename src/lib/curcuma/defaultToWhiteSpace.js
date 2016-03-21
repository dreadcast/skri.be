import { curry } from 'ramda';
import escapeRegExp from './escapeRegExp';

function defaultToWhiteSpace(str) {
	if (str.source) {
		return str.source;

	} else {
		return '[' + escapeRegExp(undefined, str) + ']';
	}
}

export default curry(defaultToWhiteSpace);
