import setBy from './setBy';
import getBy from './getBy';
import { merge } from 'ramda';

export default function mergeBy(key, value, newValue, collection) {
	var previousValue = getBy(key, value, collection) || {},
		mergedValue = merge(previousValue, newValue);

	return setBy(key, value, mergedValue, collection);
}
