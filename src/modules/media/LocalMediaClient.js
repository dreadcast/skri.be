import fs from 'fs';
import imageinfo from 'imageinfo';
import Bluebird from 'bluebird';
import logger from './../../util/logger';

var readFile = Bluebird.promisify(fs.readFile);

export function getImageInfo(path){
	return readFile(path)
		.then(imageinfo)
		.catch(error => logger.error('Error reading file ' + path, error));
}
