var 
	_ = require('hidash'),
	s = require('./../utils/superscore.string'),
	md = require('./MarkDownParser'),
	MediaCollection = require('./../Media/Collection'),
	BaseModel = require('./../Base/Model'),
	Class = require('./../Base/Class'),
// 	Parent = require('./../Base/Parent'),
// 	Prime = require('prime'),
	Path = require('path'),
	schema = {
		url: {
			type: 'string'
		},
		title: {},
		tags: {
			type: 'array'
		},
		content: {},
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
					pathToBlog: this.options.pathToBlog
				});
			}
		}
	};
	

var ArticleModel = Class({
	inherits: BaseModel,
	
	setSchema: function(){
		this.parent();
		this.schema = this.mergeSchema(schema);
		
		return this;
	},
	
	parse: function(path, cb){
		var parsedMd = new md(path);

		parsedMd.parseFile(function(rawArticle){
			this.template = rawArticle.template || this.options.template.html;
			
			this.merge(rawArticle);
			this.get('mediaCollection').addItems(rawArticle.medias, cb);
		}.bind(this));
		
		return this;
	},
	
	getRaw: function(){
		var rawObj = this.parent();

		rawObj.medias = _.map(rawObj.mediaCollection.items, function(media, i){
			return media.getRaw();
		});
		
		delete rawObj.mediaCollection;
			
		return rawObj; 
	}
});

module.exports = ArticleModel;