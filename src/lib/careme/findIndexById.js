import { findIndexBy } from './findIndexBy';

export default function findIndexById(id, collection){
	return findIndexBy('id', id, collection);
}
