import findIndexBy from './findIndexBy';
import { remove } from 'ramda';

export default function removeBy(key, value, collection) {
	return remove(findIndexBy(key, value), 1, collection);
}
