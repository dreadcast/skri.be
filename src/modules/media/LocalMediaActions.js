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

function saveImage(image, path, size) {
	logger.info(
		'Writing ' + size,
		suffixFilename('-' + size, path)
	);

	return image
		.quality(80)
		.write(suffixFilename('-' + size, path));
}

function createThumb(image, path) {
	logger.info('CREATE THUMB')
	var { width, height } = CONF.theme.imageSizes.thumb;

	image.cover(width, height, Jimp.RESIZE_BICUBIC);
	return saveImage(image, path, 'thumb');
}

function createSmall(image, path) {
	logger.info('CREATE SMALL')
	var size = CONF.theme.imageSizes.small;

	image.scaleToFit(size, size, Jimp.RESIZE_BICUBIC);
	return saveImage(image, path, 'small');
}

function resizeImage(path) {
	path = join(CONF.pathToBlog, 'data', path);

	return Jimp.read(path)
		.then(image => {
			createSmall(image, path);
			createThumb(image, path);
		})
}
