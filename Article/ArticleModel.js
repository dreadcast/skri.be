import { clean, stripTags, truncate } from 'superscore.string';
import MediaCollection from './../Media/MediaCollection';
import SuperModel from './../Base/SuperModel';
import { merge, omit } from 'lowerdash';

var schema = {
	'id': {},
	'source': {},
	'templates': {},
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
	'content': {},
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
	},
};

export default class ArticleModel extends SuperModel {
	toJSON(){
		var rawObj = super.toJSON();

		rawObj.medias = this.get('mediaCollection')
			.map(media => media.toJSON());

		// console.info(omit(rawObj, 'mediaCollection'));
		return omit(rawObj, 'mediaCollection');
	}

	setSchema(){
		this.schema = schema;

		return this;
	}
}
