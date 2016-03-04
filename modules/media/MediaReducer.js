import { merge } from 'ramda';

import {
	UPDATE_MEDIA,
} from './MediaActions.js';


var defaultMedia = {
	provider: 'local',
	mediaType: 'image',
	path: '',
	width: 0,
	height: 0,
};

export default function media(state = defaultMedia, action) {
	switch (action.type) {
		case UPDATE_MEDIA:
			return merge(action.media, state);

		default:
			return state;
	}
}
