import { Collection } from 'backbone';
import LocalMediaModel from './LocalMediaModel';
import RemoteMedia from './Model.Remote';
import Path from 'path';
import Lowerdash from 'lowerdash';
import Bluebird from 'bluebird';

export default class MediaCollection extends Collection {
	model(attributes){
		let media,
			{ url } = attributes;

		if(/^http/.test(url)){
			media = new RemoteMedia(attributes);

		} else {
			media = new LocalMediaModel(attributes);
		}

		return media;
	}

	addItems(rawMedias){
		var medias = Lowerdash.map(rawMedias, (rawMedia, id) => {
			if(Lowerdash.isArray(rawMedias)){
				rawMedia.id = rawMedia.url;

			} else {
				rawMedia.id = id;
			}

			if(!/^http/.test(rawMedia.url)){
				rawMedia.url = Path.join('/', this.ArticlePath, rawMedia.url);
			}

			this.add(rawMedia);

			var media = this.get(rawMedia.id);
			media.pathToBlog = this.pathToBlog;

			media.getOEmbedInfo();

			return media.request();
		});


		return Bluebird.all(medias);
	}
}
