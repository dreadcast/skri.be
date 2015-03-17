(function(){
	var 
		_ = require('hidash'),
		s = require('./../utils/superscore.string'),
		md = require('./MarkDownParser'),
		MediaCollection = require('./../Media/Collection'),
		Path = require('path'),
		BaseModel = require('./../Base/Model');
	
	var ArticleModel = BaseModel.extend({
		idAttribute: 'id',
		schema: {
			tags: {
				type: 'array'
			},
			created: {
				type: 'date'
			},
			status: {},
			summary: {
				compute: function(){
					var str = this.get('content');
					
					str = s.clean(str);
					str = s.stripTags(str);
					str = s.truncate(str, 300, '…');
					
					return str;
				}
			},
			cover: {},
			medias: {},
			mediaCollection: {
				initial: function(){
					var mediaCollection = new MediaCollection();
					
					mediaCollection.pathToBlog = this.options.pathToBlog;
					
					return mediaCollection;
				}
			}
		},
		
		parse: function(path, cb){
			var parsedMd = new md(path);

			parsedMd.parseFile(function(rawArticle){
				this.template = rawArticle.template || this.get('template').html;
				
				this.get('mediaCollection').addItems(rawArticle.medias, cb);
				delete rawArticle.medias;
				
				this.set(rawArticle);
			}.bind(this));
			
			return this;
		},
		
		toJSON: function(){
			var rawObj = BaseModel.prototype.toJSON.apply(this);
	
			rawObj.medias = this.get('mediaCollection').map(function(media, i){
				return media.toJSON();
			});
			
			return rawObj; 
		}
/*
*/
	});
	module.exports = ArticleModel;
})();