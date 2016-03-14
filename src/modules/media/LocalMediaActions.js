import { join } from 'path';
import { merge } from 'ramda';
import { getImageInfo } from './LocalMediaClient';
import { UPDATE_MEDIA } from './MediaActions';
import logger from './../../util/logger';
import { PATH_TO_BLOG } from '../../conf';

export function getLocalMediaInfo(media, articleId){
	return function(dispatch, getState){
		return getImageInfo(join(PATH_TO_BLOG, 'data', media.url))
			.then(info => {
				let html,
					{ width, height, type, } = info;

				if(type == 'image'){
					html = `<img src="${media.url}" alt="${media.caption}">`;
				}

				return dispatch({
					type: UPDATE_MEDIA,
					articleId,
					mediaId: media.id,
					media: merge(media, {
						width,
						height,
						html,
						type,
					}),
				})
			})
			.catch(error => logger.error('Error parsing media info', error));
	}
}
