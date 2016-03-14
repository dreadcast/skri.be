import { assoc, dissoc  } from 'ramda';

import removeById from './../../lib/careme/removeById';
import getById from './../../lib/careme/getById';
import setById from './../../lib/careme/setById';

import mediaItem from './MediaReducer.js';
import { REMOVE_MEDIA } from './mediaCollectionActions.js';
import { UPDATE_MEDIA } from './mediaActions.js';

export default function updateMedias(state = [], action) {
	switch (action.type) {
		case UPDATE_MEDIA:
			let previousMedia = getById(action.mediaId, state);

			return setById(action.mediaId, mediaItem(previousMedia, action), state);

		case REMOVE_MEDIA:
			return removeById(action.mediaId, state);

		default:
			return state;
	}
}
