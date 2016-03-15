import { join } from 'path';
import { merge } from 'ramda';
import { getImageInfo } from './LocalMediaClient';
import { UPDATE_MEDIA, getRatio } from './MediaActions';
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

				media = merge(media, {
					provider: 'local',
					width,
					height,
					html,
					type,
				});

				media = merge(media, getRatio(width, height));

				return dispatch({
					type: UPDATE_MEDIA,
					mediaId: media.id,
					articleId,
					media,
				})
			})
			.catch(error => logger.error('Error parsing media info', error));
	}
}
