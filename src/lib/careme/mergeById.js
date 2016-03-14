import mergeBy from './mergeBy';

export default function mergeById(value, newValue, collection) {
	return mergeBy('id', value, newValue, collection);
}
