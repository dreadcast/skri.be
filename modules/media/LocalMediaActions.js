import { getImageInfo } from './LocalMediaClient.js';

import { UPDATE_MEDIA } from './MediaActions.js';

export function getLocalMediaInfo(path){
	return function(dispatch, getState){
		return getImageInfo(path)
			.then(info => {
				let { width, height } = info;

				return dispatch({
					type: UPDATE_MEDIA,
					id: path,
					media: {
						path,
						width,
						height,
					},
				})
			});
	}
}
