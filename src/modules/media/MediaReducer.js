import { merge } from 'ramda';
import { UPDATE_MEDIA } from './MediaActions.js';

var defaultMedia = {
	provider: 'local',
	mediaType: 'image',
	url: '',
	width: 0,
	height: 0,
};

export default function media(state = defaultMedia, action) {
	switch (action.type) {
		case UPDATE_MEDIA:
			return merge(state, action.media);

		default:
			return state;
	}
}
