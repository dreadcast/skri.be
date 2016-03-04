import fsp from './../../lib/fs-promise.js';
import imageinfo from 'imageinfo';

export function getImageInfo(path){
	return fsp.readFile(path)
		.then(imageinfo)
		.catch(error => console.error('Error reading file ' + path, error));
}
