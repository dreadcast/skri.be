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
				type: 'collection',
		// 				require: ['medias'],
				compute: function(){
					return new MediaCollection({
						//pathToBlog: this.options.pathToBlog
					});
				}
			}
		},
		
		parse: function(path, cb){
			var parsedMd = new md(path);

			parsedMd.parseFile(function(rawArticle){
				this.template = rawArticle.template || this.get('template').html;
				
				this.set(rawArticle);
				
				cb();
				//this.get('mediaCollection').addItems(rawArticle.medias, cb);
			}.bind(this));
			
			return this;
/*
		},
		
		getRaw: function(){
			var rawObj = this.parent();
	
			rawObj.medias = _.map(rawObj.mediaCollection.items, function(media, i){
				return media.getRaw();
			});
			
			delete rawObj.mediaCollection;
				
			return rawObj; 
*/
		}
	});
	module.exports = ArticleModel;
})();