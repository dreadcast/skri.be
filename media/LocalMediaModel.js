import Lowerdash from 'lowerdash';
import Path from 'path';
import imageinfo from 'imageinfo';
import fs from 'fs';
import MediaModel from './MediaModel';
import Bluebird from 'bluebird';

var readFile = Bluebird.promisify(fs.readFile);

var schema = {
	'filename': {
		compute(){
			return Path.basename(this.get('url'));
		}
	},
	'html': {
		compute(){
			return '<img src="' + this.get('url') + '" alt="' + this.get('caption') + '">';
		}
	}
};

export default class LocalMediaModel extends MediaModel {
	setSchema(){
		super.setSchema();

		this.schema = Lowerdash.merge({}, this.schema, schema);

		return this;
	}
}
