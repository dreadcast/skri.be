import { assoc, mapObjIndexed } from 'ramda';

import { getLocalMediaInfo } from './LocalMediaActions.js';
import { getOEmbedInfo } from './RemoteMediaActions.js';

export const UPDATE_MEDIA = 'UPDATE_MEDIA';

export function getLocalMediaInfo(path){
	return function(dispatch, getState){
		if(/^http/.test(path)){
			return dispatch(getOEmbedInfo(path));

		} else {
			return dispatch(getLocalMediaInfo(path));
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

R.mapObjIndexed({ratio, name} => R.assoc(name + '-portrait', 1 / ratio, ratios), ratios);

export ratios;
