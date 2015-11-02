import { Collection } from 'backbone';
import LocalMediaModel from './LocalMediaModel';
import RemoteMedia from './Model.Remote';

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
}
