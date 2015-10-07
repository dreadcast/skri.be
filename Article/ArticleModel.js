import { clean, stripTags, truncate } from 'superscore.string';
import MediaCollection from './../Media/MediaCollection';
import SuperModel from './../Base/SuperModel';
import { merge, omit } from 'lowerdash';

var schema = {
	'title': {
		change: clean
	},
	'tags': {
		forceType: 'array'
	},
	'created': {
		forceType: 'date'
	},
	'status': {},
	'path': {},
	'summary': {
		require: ['content'],
		compute(){
			var str = this.get('content');

			str = clean(str);
			str = stripTags(str);
			str = truncate(str, 300);

			return str;
		}
	},
	'cover': {},
	'medias': {},
	'mediaCollection': {
		initial(){
			var mediaCollection = new MediaCollection();
			mediaCollection.ArticlePath = this.get('id');
			mediaCollection.pathToBlog = this.options.pathToBlog;

			return mediaCollection;
		}
	}
};

export default class ArticleModel extends SuperModel {
	getMedias(){
		return this.get('mediaCollection')
			.addItems(this.get('medias'))
			.catch((message, error) => console.error(message, error));
	}

	toJSON(){
		var rawObj = this.attributes;//super.toJSON();

		rawObj.medias = this.get('mediaCollection')
			// .map(media => media.toJSON());
			.map(media => media.attributes);

		return omit(rawObj, 'mediaCollection');
	}

	setSchema(){
		this.schema = merge({}, this.schema, schema);

		return this;
	}
}
