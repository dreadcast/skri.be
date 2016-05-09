import { join } from 'path';
import { merge } from 'ramda';
import Jimp from 'jimp';
import Bluebird from 'bluebird';
import { getImageInfo } from './LocalMediaClient';
import { UPDATE_MEDIA, getRatio } from './MediaActions';
import logger from './../../util/logger';
import CONF from '../../conf';

export function getLocalMediaInfo(media, articleId){
	return function(dispatch, getState){
		return getImageInfo(join(CONF.pathToBlog, 'data', media.url))
			.then(info => {
				let html,
					{ width, height, type, } = info;

				if(type == 'image'){
					html = `<img src="${media.url}" alt="${media.caption}">`;
				}

				media = merge(media, {
					provider: 'local',
					thumbnail: suffixFilename('-thumb', media.url),
					width,
					height,
					html,
					type,
				});

				media = merge(media, getRatio(width, height));

				dispatch({
					type: UPDATE_MEDIA,
					mediaId: media.id,
					articleId,
					media,
				});

				return media
			})
			.then(media => resizeImage(media.url))
			.catch(error => logger.error('Error parsing media info', error));
	}
}

function suffixFilename(sizeName, filename) {
	return filename.replace(/\.([a-z0-9]+)$/i, function(extension){
		return sizeName + extension;
	});
}

function resizeImage(path) {
	var sourcePath = join(CONF.pathToBlog, 'data', path);

	return Jimp.read(sourcePath)
		.then(image => image.cover(
			CONF.theme.imageSizes.thumb.width,
			CONF.theme.imageSizes.thumb.height,
		))
		.then(image => {
			logger.info('Writing thumbnail', suffixFilename('-thumb', path));

			return image
				.quality(80)
				.write(suffixFilename('-thumb', sourcePath));
		});
}
