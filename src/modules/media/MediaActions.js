import { join } from 'path';
import { assoc, mapObjIndexed, clone, merge, values, keys } from 'ramda';
import closest from '../../lib/careme/closest';
import { getLocalMediaInfo } from './LocalMediaActions';
import { getOEmbedInfo } from './RemoteMediaActions';
import logger from '../../util/logger';

export const UPDATE_MEDIA = 'UPDATE_MEDIA';

export function formatMedia(media) {
	var newMedia = clone(media);

	if(!media.id){
		if(media.url){
			newMedia = assoc('id', media.url, newMedia);

		} else if(typeof media == 'string'){
			newMedia = {
				id: media,
				url: media
			};

		} else {
			newMedia = merge(media, {
				id: media,
				url: media
			});
		}
	}

	return newMedia;
}

export function getMediaInfo(media, articleId){
	return function(dispatch, getState){
		if(/^http/.test(media.url)){
			return dispatch(getOEmbedInfo(media, articleId));

		} else {
			let fixedUrl = join(articleId, media.url);

			media = assoc('url', '/' + fixedUrl, media);

			return dispatch(getLocalMediaInfo(media, articleId));
		}
	}
}

var ratios = {
	'mgm': 2.76,
	'cinerama': 2.59,
	'cinemascope': 2.55,
	'technirama': 2.35,
	'techniscope': 2.33,
	'todd-ao': 2.2,
	'superscope': 2,
	'vistavision': 1.85,
	'16by9': 1.77,
	'5by3': 1.66,
	'16by10': 1.6,
	'14by9': 1.56,
	'3by2': 1.5,
	'imax': 1.43,
	'academy': 1.375,
	'pathe-kok': 1.36,
	'super-8': 1.35,
	'4by3': 1.33,
	'5by4': 1.25,
	'1by1': 1,
}

mapObjIndexed(({ratio, name}) => assoc(name + '-portrait', 1 / ratio, ratios), ratios);

export const RATIOS = ratios;

const RATIO_KEYS = keys(RATIOS);
const RATIO_VALUES = values(RATIOS);

export function getRatio(width, height) {
	var actualRatio = width / height,
		ratio = closest(actualRatio, RATIO_VALUES),
		ratioIndex = RATIO_VALUES.indexOf(ratio),
		ratioName = RATIO_KEYS[ratioIndex];

	return {
		actualRatio,
		ratioName,
		ratio,
	}
}
