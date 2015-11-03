import { merge } from 'lowerdash';
import MediaModel from './MediaModel';

var schema = {
	'html': {},
	'embedUrl': {}
};

export default class RemoteMediaModel extends MediaModel {
	setSchema(){
		super.setSchema();

		this.schema = merge({}, this.schema, schema);

		return this;
	}
}
