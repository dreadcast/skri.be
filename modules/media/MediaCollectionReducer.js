import { assoc, dissoc  } from 'ramda';

import mediaItem from './MediaReducer.js';
import {
	REMOVE_MEDIA,
	ADD_MEDIA,
} from './mediaCollectionActions.js';

export default function mediaCollection(state = {}, action) {
	switch (action.type) {
		case ADD_MEDIA:
			return assoc(id, mediaItem(state[action.id], action), state);

		case REMOVE_MEDIA:
			return dissoc(action.id, state);

		default:
			return state;
	}
}
