import removeBy from './removeBy';

export default function removeById(value, collection) {
	return removeBy('id', value, collection);
}
