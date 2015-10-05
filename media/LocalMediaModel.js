import Lowerdash from 'lowerdash';
import Path from 'path';
import imageinfo from 'imageinfo';
import fs from 'fs';
import MediaModel from './MediaModel';

var schema = {
	'filename': {
		require: ['url'],
		compute: function(){
			return Path.basename(this.get('url'));
		}
	},
	'html': {
		require: ['url', 'title'],
		compute: function(){
			return '<img src="' + this.get('url') + this.get('title') + '">';
		}
	}
};

export default class LocalMediaModel extends MediaModel {
	getOEmbedInfo(){
		return this
			.set('provider', 'local')
			.set('type', 'image');
	}

	setSchema(){
		this.schema = Lowerdash.merge({}, this.schema, schema);

		return this;
	}

	request(){
		var path = Path.join(this.pathToBlog, 'data', this.get('url'));

		return new Promise((resolve, reject) => {
			return fs.readFile(path, (error, data) => {
				if(error){
					return reject('Error reading file ' + path, error);

				} else {
					try{
						var { width, height } = imageinfo(data);

						this.set({
							width,
							height
						});

						return resolve(this);

					} catch(e){
						return reject('Image info error', e);
					}
				}
			});
		});
	}
}
