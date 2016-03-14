import findIndexBy from './findIndexBy';
import { update, append } from 'ramda';

export default function setBy(key, value, newValue, collection) {
	var index = findIndexBy(key, value, collection);

	if(index > -1) {
		return update(findIndexBy(key, value, collection), newValue, collection);
	}

	return append(newValue, collection);
}
