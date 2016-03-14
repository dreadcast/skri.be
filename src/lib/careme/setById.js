import setBy from './setBy';

export default function setById(value, newValue, collection) {
	return setBy('id', value, newValue, collection);
}
