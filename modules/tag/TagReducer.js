import { concat, curry, uniq } from 'ramda';
import { ADD_TAGS } from './TagActions.js';

var defaultTags = [];

function addTags(tags, state){
	return uniq(concat(tags, state), state);
}
export default function tag(state = defaultTags, action) {
	switch (action.type) {
		case ADD_TAGS:
			return addTags(action.tags, state);

		default:
			return state;
	}
}
