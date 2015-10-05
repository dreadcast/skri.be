import SuperModel from './../Base/SuperModel';
import Lowerdash from 'lowerdash';

let ratios = {
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
	'1by1': 1
};

let schema = {
	'title': {},
	'provider': {},
	'url': {},
	'id': {},
	'type': {},
	'width': {
		type: 'number'
	},
	'height': {
		type: 'number'
	},
	'ratio.actual': {
		require: ['width', 'height'],
		compute: function(){
			return this.get('width') / this.get('height');
		}
	},
	'ratio.round': {
		require: ['width', 'height'],
		compute: function(){
			return Lowerdash.closest(Lowerdash.values(ratios).sort(), this.get('ratio.actual'));
		}
	},
	'ratio.name': {
		require: ['width', 'height'],
		compute: function(){
			return Lowerdash.keyOf(ratios, this.get('ratio.round'));
		}
	}
};

Lowerdash.each(ratios, function(ratio, name){
	ratios[name + '-portrait'] = 1 / ratio;
});


export default class MediaModel extends SuperModel {
	setSchema(){
		this.schema = Lowerdash.merge({}, this.schema, schema);

		return this;
	}
}
