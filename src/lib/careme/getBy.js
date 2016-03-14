import findIndexBy from './findIndexBy';

export default function getBy(key, value, collection){
	return collection[findIndexBy(key, value, collection)];
}
