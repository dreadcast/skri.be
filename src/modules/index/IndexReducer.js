import { assoc, map, uniq, merge, append } from 'ramda';
import { mergeBy } from './../../lib/careme/mergeBy';
import { ADD_WORDS } from './IndexActions.js';
import logger from './../../util/logger';

var defaultWords = {};

function addWords(articleId, words, state){
	map(word => {
		var newIndex = uniq(append(articleId, state[word] || []));
		state = assoc(word.toLowerCase(), newIndex, state);
	}, words);

	return state;
}

export default function index(state = defaultWords, action) {
	switch (action.type) {
		case ADD_WORDS:
			var { articleId, words } = action;

			return addWords(articleId, words, state);

		default:
			return state;
	}
}
