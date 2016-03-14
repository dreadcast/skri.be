import { findIndex, propEq } from 'ramda';

export default function findIndexBy(key, value, collection){
	return findIndex(propEq(key, value), collection);
}
